import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user's company
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

    // Get total departments
    const { data: departments, error: deptError } = await supabase
      .from("departments")
      .select("id")
      .eq("company_id", employee.company_id);

    if (deptError) {
      console.error("Error fetching departments:", deptError);
      return NextResponse.json({ error: deptError.message }, { status: 500 });
    }

    // Get total employees in company
    const { data: employees, error: empError } = await supabase
      .from("employees")
      .select("id, department_id")
      .eq("company_id", employee.company_id);

    if (empError) {
      console.error("Error fetching employees:", empError);
      return NextResponse.json({ error: empError.message }, { status: 500 });
    }

    const totalDepartments = departments?.length || 0;
    const totalEmployees = employees?.length || 0;
    const avgTeamSize =
      totalDepartments > 0 ? Math.round(totalEmployees / totalDepartments) : 0;

    return NextResponse.json({
      totalDepartments,
      totalEmployees,
      avgTeamSize,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
