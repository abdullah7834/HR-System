import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: departments, error } = await supabase
      .from("departments")
      .select(
        `
        *,
        manager:employees!fk_departments_manager(id, first_name, last_name, job_title),
        company:companies(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching departments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ departments });
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
    const body = await req.json();
    const { name, description, manager_id } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the company ID from the current user's employee record
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

    const { data: employee } = await supabase
      .from("employees")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!employee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 }
      );
    }

    // Check if department already exists for this company
    const { data: existingDept } = await supabase
      .from("departments")
      .select("id")
      .eq("company_id", employee.company_id)
      .eq("name", name)
      .single();

    if (existingDept) {
      return NextResponse.json(
        { error: "Department with this name already exists" },
        { status: 409 }
      );
    }

    // Create department
    const { data: department, error } = await supabase
      .from("departments")
      .insert({
        company_id: employee.company_id,
        name,
        description,
        manager_id: manager_id || null,
      })
      .select(
        `
        *,
        manager:employees!fk_departments_manager(id, first_name, last_name, job_title),
        company:companies(name)
      `
      )
      .single();

    if (error) {
      console.error("Error creating department:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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
