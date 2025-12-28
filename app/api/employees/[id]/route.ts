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
        role_id,
        employee_code,
        gender,
        address,
        status,
        role:role_id(id, name),
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

    // Fetch all roles for this employee from junction table
    const { data: employeeRoles, error: rolesError } = await supabase
      .from("employee_roles")
      .select(
        `
        role_id,
        roles(id, name)
      `
      )
      .eq("employee_id", employeeId);

    if (rolesError) {
      console.error("Error fetching employee roles:", rolesError);
      return NextResponse.json(
        { error: "Failed to fetch employee roles" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      employee,
      roles: employeeRoles,
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
      role_id,
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

    if (!role_id) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
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
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!currentEmployee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 }
      );
    }

    // Update employee record
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
        department_id: department_id ? parseInt(department_id) : null,
        role_id: parseInt(role_id),
        gender,
        address,
        updated_at: new Date().toISOString(),
      })
      .eq("id", employeeId)
      .eq("company_id", currentEmployee.company_id)
      .select()
      .single();

    if (updateError) {
      console.error("Employee update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Delete existing role and add new one
    const { error: deleteError } = await supabase
      .from("employee_roles")
      .delete()
      .eq("employee_id", employeeId);

    if (deleteError) {
      console.error("Error deleting employee roles:", deleteError);
      return NextResponse.json(
        { error: "Failed to update role" },
        { status: 500 }
      );
    }

    // Add new employee role
    const { error: rolesError } = await supabase.from("employee_roles").insert({
      employee_id: employeeId,
      role_id: parseInt(role_id),
    });

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
