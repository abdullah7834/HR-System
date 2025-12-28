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
      role_id, // Single role ID
      employee_code,
      gender,
      address,
    } = body;

    // Validation
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: "Email, password, first name, and last name are required" },
        { status: 400 }
      );
    }

    if (!role_id) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
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

    // Get current user's company
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: currentEmployee } = await supabase
      .from("employees")
      .select("company_id")
      .eq("user_id", currentUser.id)
      .single();

    if (!currentEmployee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 }
      );
    }

    // Generate employee code: EMP + timestamp + random 3 digits
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const generatedEmployeeCode = `EMP${timestamp}${random}`;

    // Create employee record with user_id
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .insert({
        company_id: currentEmployee.company_id,
        user_id: userId,
        first_name,
        last_name,
        email,
        phone,
        job_title,
        employment_type,
        date_of_joining,
        salary: salary ? parseFloat(salary) : null,
        department_id: department_id ? parseInt(department_id) : null,
        role_id: parseInt(role_id), // Primary role
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

    // Add employee role to junction table
    const { error: rolesError } = await supabase.from("employee_roles").insert({
      employee_id: employee.id,
      role_id: parseInt(role_id),
    });

    if (rolesError) {
      console.error("Employee role creation error:", rolesError);
      return NextResponse.json(
        { error: "Failed to assign role" },
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
