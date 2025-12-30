import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get accessible departments for filtering
    const { getAccessibleDepartmentIds } = await import("@/lib/department-utils");
    const accessibleDeptIds = await getAccessibleDepartmentIds();

    // Get task with all related data
    const { data: task, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        assignee:assignee_id(id, first_name, last_name, email),
        reporter:reporter_id(id, first_name, last_name, email),
        project:project_id(id, name),
        department:department_id(id, name),
        comments:task_comments(
          id,
          comment,
          created_at,
          employee:employee_id(id, first_name, last_name, email)
        ),
        attachments:task_attachments(
          id,
          file_name,
          file_path,
          file_size,
          file_type,
          uploaded_by,
          created_at
        )
      `
      )
      .eq("id", taskId)
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
      .single();

    if (error) {
      console.error("Error fetching task:", error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const body = await req.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

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
      actual_hours,
      tags,
      metadata,
      completed_at,
    } = body;

    // Validate department access if changing department
    if (department_id && !accessibleDeptIds.includes(department_id)) {
      return NextResponse.json(
        { error: "You don't have access to this department" },
        { status: 403 }
      );
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (assignee_id !== undefined) updateData.assignee_id = assignee_id;
    if (project_id !== undefined) updateData.project_id = project_id;
    if (department_id !== undefined) updateData.department_id = department_id;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (estimated_hours !== undefined)
      updateData.estimated_hours = estimated_hours
        ? parseFloat(estimated_hours)
        : null;
    if (actual_hours !== undefined)
      updateData.actual_hours = actual_hours ? parseFloat(actual_hours) : null;
    if (tags !== undefined) updateData.tags = tags;
    if (metadata !== undefined) updateData.metadata = metadata;
    if (completed_at !== undefined) updateData.completed_at = completed_at;
    if (status === "done" && !completed_at) {
      updateData.completed_at = new Date().toISOString();
    }

    // Update task
    const { data: task, error: updateError } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", taskId)
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
      .select()
      .single();

    if (updateError) {
      console.error("Error updating task:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      task,
      message: "Task updated successfully",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

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

    // Get accessible departments
    const { getAccessibleDepartmentIds } = await import("@/lib/department-utils");
    const accessibleDeptIds = await getAccessibleDepartmentIds();

    // Delete task
    const { error: deleteError } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null]);

    if (deleteError) {
      console.error("Error deleting task:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}

