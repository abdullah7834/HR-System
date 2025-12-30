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

    // Get task stats
    const { count: myTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("assignee_id", employee.id)
      .in("status", ["todo", "in_progress", "review"]);

    const { count: completedTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("assignee_id", employee.id)
      .eq("status", "done");

    // Get pending leaves
    const { count: pendingLeaves } = await supabase
      .from("leaves")
      .select("*", { count: "exact", head: true })
      .eq("employee_id", employee.id)
      .eq("status", "pending");

    // Get upcoming holidays (next 30 days)
    const { count: upcomingHolidays } = await supabase
      .from("holidays")
      .select("*", { count: "exact", head: true })
      .gte("date", new Date().toISOString().split('T')[0])
      .lte("date", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .eq("is_active", true);

    // Get weekly task data
    const { data: tasks } = await supabase
      .from("tasks")
      .select("status, created_at, completed_at")
      .eq("assignee_id", employee.id)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Process task data for charts
    const taskStatusData = [
      { name: 'To Do', value: myTasks || 0, color: '#94a3b8' },
      { name: 'In Progress', value: tasks?.filter(t => t.status === 'in_progress').length || 0, color: '#3b82f6' },
      { name: 'Review', value: tasks?.filter(t => t.status === 'review').length || 0, color: '#f59e0b' },
      { name: 'Done', value: completedTasks || 0, color: '#22c55e' },
    ];

    return NextResponse.json({
      stats: {
        myTasks: myTasks || 0,
        completedTasks: completedTasks || 0,
        pendingLeaves: pendingLeaves || 0,
        upcomingHolidays: upcomingHolidays || 0,
      },
      taskData: taskStatusData,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

