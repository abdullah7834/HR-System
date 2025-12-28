import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { employee_id, status } = body;

    if (!employee_id || !status) {
      return NextResponse.json(
        { error: "Employee ID and status are required" },
        { status: 400 }
      );
    }

    if (!["Active", "Inactive"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be either Active or Inactive" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: employee, error } = await supabase
      .from("employees")
      .update({ status })
      .eq("id", employee_id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ employee });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
