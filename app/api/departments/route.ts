import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// GET - List all departments
export async function GET() {
  try {
    const adminClient = await createAdminClient();

    const { data: departments, error } = await adminClient
      .from("departments")
      .select(
        `
        *,
        manager:employees!fk_departments_manager(id, first_name, last_name, job_title),
        company:companies(id, name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching departments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ departments: departments || [] });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}

// POST - Create a new department
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, manager_id, company_id } = body;

    // Validation
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      );
    }

    const adminClient = await createAdminClient();

    // Get first company if company_id not provided
    let targetCompanyId = company_id;
    if (!targetCompanyId) {
      const { data: companies } = await adminClient
        .from("companies")
        .select("id")
        .limit(1)
        .single();
      
      if (companies) {
        targetCompanyId = companies.id;
      } else {
        return NextResponse.json(
          { error: "No company found. Please create a company first." },
          { status: 404 }
        );
      }
    }

    // Check if department already exists for this company
    const { data: existingDept } = await adminClient
      .from("departments")
      .select("id")
      .eq("company_id", targetCompanyId)
      .eq("name", name.trim())
      .single();

    if (existingDept) {
      return NextResponse.json(
        { error: "Department with this name already exists" },
        { status: 409 }
      );
    }

    // Create department
    const { data: department, error } = await adminClient
      .from("departments")
      .insert({
        company_id: targetCompanyId,
        name: name.trim(),
        description: description?.trim() || null,
        manager_id: manager_id || null,
        is_active: true, // Default to active
      })
      .select(
        `
        *,
        manager:employees!fk_departments_manager(id, first_name, last_name, job_title),
        company:companies(id, name)
      `
      )
      .single();

    if (error) {
      console.error("Error creating department:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ department }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
