import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: employee } = await supabase
      .from("employees")
      .select("id, department_id")
      .eq("user_id", user.id)
      .single();

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Get projects managed by this employee
    const { data: managedProjects } = await supabase
      .from("projects")
      .select("id")
      .eq("manager_id", employee.id);

    const projectIds = managedProjects?.map(p => p.id) || [];

    const { count: activeProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("manager_id", employee.id)
      .in("status", ["Planned", "In Progress"]);

    const { count: totalTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .in("project_id", projectIds);

    const { count: doneTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .in("project_id", projectIds)
      .eq("status", "done");

    const completionRate = totalTasks && totalTasks > 0
      ? Math.round((doneTasks || 0) / totalTasks * 100)
      : 0;

    // Get team members (employees assigned to tasks in managed projects)
    const { data: taskAssignees } = await supabase
      .from("tasks")
      .select("assignee_id")
      .in("project_id", projectIds)
      .not("assignee_id", "is", null);

    const uniqueTeamMembers = new Set(taskAssignees?.map(t => t.assignee_id).filter(Boolean) || []);

    // Get project status distribution
    const { data: projects } = await supabase
      .from("projects")
      .select("status")
      .eq("manager_id", employee.id);

    const projectStatusData = [
      { name: 'In Progress', value: projects?.filter(p => p.status === 'In Progress').length || 0, color: '#3b82f6' },
      { name: 'Planning', value: projects?.filter(p => p.status === 'Planned').length || 0, color: '#f59e0b' },
      { name: 'Completed', value: projects?.filter(p => p.status === 'Completed').length || 0, color: '#22c55e' },
      { name: 'On Hold', value: projects?.filter(p => p.status === 'On Hold').length || 0, color: '#ef4444' },
    ];

    // Get task progress by project
    const { data: projectsWithTasks } = await supabase
      .from("projects")
      .select("id, name")
      .eq("manager_id", employee.id)
      .limit(4);

    const taskProgressData = await Promise.all(
      (projectsWithTasks || []).map(async (project) => {
        const { count: total } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("project_id", project.id);
        
        const { count: completed } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("project_id", project.id)
          .eq("status", "done");

        return {
          project: project.name,
          completed: completed || 0,
          total: total || 0,
        };
      })
    );

    return NextResponse.json({
      stats: {
        activeProjects: activeProjects || 0,
        totalTasks: totalTasks || 0,
        teamMembers: uniqueTeamMembers.size,
        completionRate,
      },
      projectStatusData,
      taskProgressData,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}


