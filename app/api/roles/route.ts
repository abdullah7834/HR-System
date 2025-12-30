import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get distinct roles from employee_roles table
    const { data: roles, error } = await supabase
      .from("employee_roles")
      .select("role_name, role_description, is_system_role")
      .order("role_name");

    if (error) {
      console.error("Error fetching roles:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get unique roles
    const uniqueRoles = Array.from(
      new Map(
        roles.map((r) => [
          r.role_name,
          {
            name: r.role_name,
            description: r.role_description,
            is_system_role: r.is_system_role,
          },
        ])
      ).values()
    );

    return NextResponse.json({ roles: uniqueRoles });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
