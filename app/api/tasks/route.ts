import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get current employee
    const { data: currentEmployee } = await supabase
      .from("employees")
      .select("id, department_id")
      .eq("user_id", user.id)
      .single();

    if (!currentEmployee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 }
      );
    }

    // Get accessible departments
    const { getAccessibleDepartmentIds } = await import("@/lib/department-utils");
    const accessibleDeptIds = await getAccessibleDepartmentIds();

    // Build query with filters
    let query = supabase
      .from("tasks")
      .select(
        `
        *,
        assignee:assignee_id(id, first_name, last_name, email),
        reporter:reporter_id(id, first_name, last_name, email),
        project:project_id(id, name),
        department:department_id(id, name)
      `
      )
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null]);

    // Apply filters
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const assigneeId = searchParams.get("assignee_id");
    const projectId = searchParams.get("project_id");
    const departmentId = searchParams.get("department_id");
    const myTasks = searchParams.get("my_tasks") === "true";

    if (status) {
      query = query.eq("status", status);
    }

    if (priority) {
      query = query.eq("priority", priority);
    }

    if (assigneeId) {
      query = query.eq("assignee_id", assigneeId);
    }

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    if (departmentId) {
      query = query.eq("department_id", departmentId);
    }

    if (myTasks) {
      query = query.eq("assignee_id", currentEmployee.id);
    }

    const { data: tasks, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks: tasks || [] });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const {
      title,
      description,
      status,
      priority,
      assignee_id,
      project_id,
      department_id,
      due_date,
      start_date,
      estimated_hours,
      tags,
      metadata,
    } = body;

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get current employee
    const { data: currentEmployee } = await supabase
      .from("employees")
      .select("id, department_id, company_id")
      .eq("user_id", user.id)
      .single();

    if (!currentEmployee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 }
      );
    }

    // Get company_id from department
    const targetDeptId = department_id || currentEmployee.department_id;
    const { data: department } = await supabase
      .from("departments")
      .select("company_id")
      .eq("id", targetDeptId)
      .single();

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    // Create task
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .insert({
        company_id: department.company_id,
        project_id: project_id || null,
        department_id: targetDeptId,
        title,
        description: description || null,
        status: status || "todo",
        priority: priority || "medium",
        assignee_id: assignee_id || null,
        reporter_id: currentEmployee.id,
        due_date: due_date || null,
        start_date: start_date || null,
        estimated_hours: estimated_hours ? parseFloat(estimated_hours) : null,
        tags: tags || [],
        metadata: metadata || {},
        created_by: currentEmployee.id,
      })
      .select()
      .single();

    if (taskError) {
      console.error("Error creating task:", taskError);
      return NextResponse.json({ error: taskError.message }, { status: 500 });
    }

    return NextResponse.json({ task, message: "Task created successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}

