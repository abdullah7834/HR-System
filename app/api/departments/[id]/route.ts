import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// GET - Get a single department by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    const adminClient = await createAdminClient();

    const { data: department, error } = await adminClient
      .from("departments")
      .select(
        `
        *,
        manager:employees!fk_departments_manager(id, first_name, last_name, job_title),
        company:companies(id, name)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching department:", error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ department });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}

// PATCH - Update a department (including activate/deactivate)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    const adminClient = await createAdminClient();

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.description !== undefined)
      updateData.description = body.description?.trim() || null;
    if (body.manager_id !== undefined)
      updateData.manager_id = body.manager_id || null;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.company_id !== undefined) updateData.company_id = body.company_id;

    // Update department
    const { data: department, error } = await adminClient
      .from("departments")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        manager:employees!fk_departments_manager(id, first_name, last_name, job_title),
        company:companies(id, name)
      `
      )
      .single();

    if (error) {
      console.error("Error updating department:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ department });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a department
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    const adminClient = await createAdminClient();

    // Check if department has employees
    const { data: employees } = await adminClient
      .from("employees")
      .select("id")
      .eq("department_id", id)
      .limit(1);

    if (employees && employees.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete department with employees. Please reassign employees first.",
        },
        { status: 409 }
      );
    }

    // Delete department
    const { error } = await adminClient.from("departments").delete().eq("id", id);

    if (error) {
      console.error("Error deleting department:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}

