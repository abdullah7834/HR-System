import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

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

    let data: any[] = [];

    switch (type) {
      case "roles":
        // Get distinct roles from employee_roles
        const { data: rolesData } = await supabase
          .from("employee_roles")
          .select("role_name, role_description, is_system_role")
          .order("role_name");

        if (rolesData) {
          const uniqueRoles = Array.from(
            new Map(
              rolesData.map((r) => [
                r.role_name,
                {
                  value: r.role_name,
                  label: r.role_name,
                  description: r.role_description,
                  is_system_role: r.is_system_role,
                },
              ])
            ).values()
          );
          data = uniqueRoles;
        }
        break;

      case "departments":
        const { data: departments } = await supabase
          .from("departments")
          .select("id, name")
          .in("id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
          .eq("is_active", true)
          .order("name");

        data =
          departments?.map((d) => ({
            value: d.id,
            label: d.name,
          })) || [];
        break;

      case "employees":
        const { data: employees } = await supabase
          .from("employees")
          .select("id, first_name, last_name, email, employee_code")
          .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
          .eq("status", "Active")
          .order("first_name");

        data =
          employees?.map((e) => ({
            value: e.id,
            label: `${e.first_name} ${e.last_name}`,
            email: e.email,
            code: e.employee_code,
          })) || [];
        break;

      case "projects":
        const { data: projects } = await supabase
          .from("projects")
          .select("id, name, status")
          .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
          .order("name");

        data =
          projects?.map((p) => ({
            value: p.id,
            label: p.name,
            status: p.status,
          })) || [];
        break;

      case "companies":
        // Get company from user's department
        const { data: currentEmployee } = await supabase
          .from("employees")
          .select("department_id")
          .eq("user_id", user.id)
          .single();

        if (currentEmployee?.department_id) {
          const { data: dept } = await supabase
            .from("departments")
            .select("company_id, companies(id, name)")
            .eq("id", currentEmployee.department_id)
            .single();

          if (dept?.companies) {
            data = [{
              value: dept.companies.id,
              label: dept.companies.name,
            }];
          }
        }
        break;

      case "task_statuses":
        data = [
          { value: "todo", label: "To Do" },
          { value: "in_progress", label: "In Progress" },
          { value: "review", label: "Review" },
          { value: "done", label: "Done" },
          { value: "blocked", label: "Blocked" },
          { value: "cancelled", label: "Cancelled" },
        ];
        break;

      case "task_priorities":
        data = [
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
          { value: "urgent", label: "Urgent" },
        ];
        break;

      case "employment_types":
        data = [
          { value: "full_time", label: "Full Time" },
          { value: "part_time", label: "Part Time" },
          { value: "contract", label: "Contract" },
          { value: "intern", label: "Intern" },
          { value: "freelance", label: "Freelance" },
        ];
        break;

      default:
        return NextResponse.json(
          { error: "Invalid dropdown type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}

