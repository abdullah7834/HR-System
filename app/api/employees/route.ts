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

    // const { data: employee } = await supabase.from("employees");
    //   .select("company_id")
    //   .eq("user_id", user.id)
    //   .single();

    // if (!employee) {
    //   return NextResponse.json(
    //     { error: "Employee record not found" },
    //     { status: 404 }
    //   );
    // }

    // Fetch all employees from the same company with full details
    const { data: employees, error } = await supabase
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
        role:role_id(id, name),
        department:department_id(id, name),
        company:company_id(name)
      `
      )
      //   .eq("company_id", employee.company_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching employees:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ employees });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
