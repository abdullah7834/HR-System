import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      job_title,
      employment_type,
      date_of_joining,
      salary,
      department_id,
      role_name, // Role name instead of role_id
      role_description,
      is_system_role,
      employee_code,
      gender,
      address,
      roles, // Array of roles for multiple role assignment
    } = body;

    // Validation
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: "Email, password, first name, and last name are required" },
        { status: 400 }
      );
    }

    // Support both single role_name and array of roles
    const rolesToAssign = roles && Array.isArray(roles) && roles.length > 0 
      ? roles 
      : role_name 
        ? [{ name: role_name, description: role_description || null, is_system_role: is_system_role || false }]
        : null;

    if (!rolesToAssign || rolesToAssign.length === 0) {
      return NextResponse.json({ error: "At least one role is required" }, { status: 400 });
    }

    // Create auth user first
    const adminClient = await createAdminClient();
    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // Get current user's department
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: currentEmployee } = await supabase
      .from("employees")
      .select("department_id, company_id")
      .eq("user_id", currentUser.id)
      .single();

    if (!currentEmployee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 }
      );
    }

    // Use provided department_id or default to current user's department
    const targetDepartmentId = department_id || currentEmployee.department_id;
    
    if (!targetDepartmentId) {
      return NextResponse.json(
        { error: "Department is required" },
        { status: 400 }
      );
    }

    // Generate employee code: EMP + timestamp + random 3 digits
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const generatedEmployeeCode = `EMP${timestamp}${random}`;

    // Get company_id from department
    const { data: department } = await supabase
      .from("departments")
      .select("company_id")
      .eq("id", targetDepartmentId)
      .single();

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    // Create employee record with user_id (no role_id column anymore)
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .insert({
        company_id: department.company_id,
        user_id: userId,
        first_name,
        last_name,
        email,
        phone,
        job_title,
        employment_type,
        date_of_joining,
        salary: salary ? parseFloat(salary) : null,
        department_id: targetDepartmentId,
        employee_code: employee_code || generatedEmployeeCode,
        gender,
        address,
        status: "Active",
      })
      .select()
      .single();

    if (empError) {
      console.error("Employee creation error:", empError);
      return NextResponse.json({ error: empError.message }, { status: 500 });
    }

    // Add employee roles to employee_roles table
    const rolesToInsert = rolesToAssign.map((role: any) => ({
      employee_id: employee.id,
      role_name: role.name || role.role_name,
      role_description: role.description || role.role_description || null,
      is_system_role: role.is_system_role || false,
      assigned_at: new Date().toISOString(),
    }));

    const { error: rolesError } = await supabase
      .from("employee_roles")
      .insert(rolesToInsert);

    if (rolesError) {
      console.error("Employee role creation error:", rolesError);
      return NextResponse.json(
        { error: "Failed to assign role(s)" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      employee,
      message: `Employee created with code: ${employee.employee_code}`,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
