import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: employeeId } = await params;

    // Validate ID format (could be UUID or integer)
    if (!employeeId || employeeId.trim() === "") {
      return NextResponse.json(
        { error: "Invalid employee ID" },
        { status: 400 }
      );
    }

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

    // const { data: currentEmployee } = await supabase
    //   .from("employees")
    //   .select("company_id")
    //   .eq("user_id", user.id)
    //   .single();

    // if (!currentEmployee) {
    //   return NextResponse.json(
    //     { error: "Employee record not found" },
    //     { status: 404 }
    //   );
    // }

    // Fetch employee with all details
    const { data: employee, error } = await supabase
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
        salary,
        department_id,
        employee_code,
        gender,
        address,
        status,
        department:department_id(id, name)
      `
      )
      .eq("id", employeeId)
      //   .eq("company_id", currentEmployee.company_id)
      .single();

    if (error) {
      console.error("Error fetching employee:", error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Fetch all roles for this employee from employee_roles table
    const { data: employeeRoles, error: rolesError } = await supabase
      .from("employee_roles")
      .select(
        `
        id,
        role_name,
        role_description,
        is_system_role,
        assigned_at
      `
      )
      .eq("employee_id", employeeId)
      .order("assigned_at", { ascending: false });

    if (rolesError) {
      console.error("Error fetching employee roles:", rolesError);
      return NextResponse.json(
        { error: "Failed to fetch employee roles" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      employee,
      roles: employeeRoles || [],
    });
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
    const { id: employeeId } = await params;
    const body = await req.json();
    console.log(body);
    if (!employeeId || employeeId.trim() === "") {
      return NextResponse.json(
        { error: "Invalid employee ID" },
        { status: 400 }
      );
    }

    const {
      first_name,
      last_name,
      phone,
      job_title,
      employment_type,
      date_of_joining,
      salary,
      department_id,
      roles, // Array of roles
      gender,
      address,
    } = body;

    // Validation
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    // Support both single role_name and array of roles
    const rolesToAssign = roles && Array.isArray(roles) && roles.length > 0 
      ? roles 
      : null;

    if (!rolesToAssign || rolesToAssign.length === 0) {
      return NextResponse.json({ error: "At least one role is required" }, { status: 400 });
    }

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

    const { data: currentEmployee } = await supabase
      .from("employees")
      .select("department_id")
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

    // Validate department access
    if (department_id && !accessibleDeptIds.includes(department_id)) {
      return NextResponse.json(
        { error: "You don't have access to this department" },
        { status: 403 }
      );
    }

    // Update employee record (no role_id column anymore)
    const { data: updatedEmployee, error: updateError } = await supabase
      .from("employees")
      .update({
        first_name,
        last_name,
        phone,
        job_title,
        employment_type,
        date_of_joining,
        salary: salary ? parseFloat(salary) : null,
        department_id: department_id || currentEmployee.department_id,
        gender,
        address,
        updated_at: new Date().toISOString(),
      })
      .eq("id", employeeId)
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
      .select()
      .single();

    if (updateError) {
      console.error("Employee update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Delete existing roles and add new ones
    const { error: deleteError } = await supabase
      .from("employee_roles")
      .delete()
      .eq("employee_id", employeeId);

    if (deleteError) {
      console.error("Error deleting employee roles:", deleteError);
      return NextResponse.json(
        { error: "Failed to update roles" },
        { status: 500 }
      );
    }

    // Add new employee roles
    const rolesToInsert = rolesToAssign.map((role: any) => ({
      employee_id: employeeId,
      role_name: role.name || role.role_name,
      role_description: role.description || role.role_description || null,
      is_system_role: role.is_system_role || false,
      assigned_at: new Date().toISOString(),
    }));

    const { error: rolesError } = await supabase
      .from("employee_roles")
      .insert(rolesToInsert);

    if (rolesError) {
      console.error("Employee roles creation error:", rolesError);
      return NextResponse.json(
        { error: "Failed to assign roles" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      employee: updatedEmployee,
      message: "Employee updated successfully",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
