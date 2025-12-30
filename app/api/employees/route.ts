import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// GET - List all employees (no RLS, no roles - simple CRUD)
export async function GET() {
  try {
    const adminClient = await createAdminClient();

    const { data: employees, error } = await adminClient
      .from("employees")
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        phone,
        job_title,
        employment_type,
        date_of_joining,
        employee_code,
        status,
        employee_roles(role_name, role_description, is_system_role),
        department:department_id(id, name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching employees:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ employees: employees || [] });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
