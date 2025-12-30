import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAccessibleDepartmentIds } from "@/lib/department-utils";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const accessibleDeptIds = await getAccessibleDepartmentIds();

    // Get all employees in accessible departments
    const { count: totalEmployees } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null]);

    const { count: totalDepartments } = await supabase
      .from("departments")
      .select("*", { count: "exact", head: true })
      .in("id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
      .eq("is_active", true);

    const { count: activeProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
      .in("status", ["Planned", "In Progress"]);

    // Get department distribution
    const { data: departments } = await supabase
      .from("departments")
      .select("id, name")
      .in("id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
      .eq("is_active", true);

    const departmentDistribution = await Promise.all(
      (departments || []).map(async (dept) => {
        const { count } = await supabase
          .from("employees")
          .select("*", { count: "exact", head: true })
          .eq("department_id", dept.id)
          .eq("status", "Active");
        return {
          name: dept.name,
          employees: count || 0,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
      })
    );

    // Calculate monthly revenue from payroll
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const { data: payrollData } = await supabase
      .from("payroll")
      .select("net_salary")
      .eq("status", "paid")
      .gte("pay_date", `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
      .lt("pay_date", `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`);

    const monthlyRevenue = payrollData?.reduce((sum, p) => sum + Number(p.net_salary || 0), 0) || 0;

    // Employee growth data (last 6 months)
    const employeeGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const { count } = await supabase
        .from("employees")
        .select("*", { count: "exact", head: true })
        .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
        .lte("created_at", monthEnd.toISOString());

      employeeGrowth.push({
        month: date.toLocaleString('default', { month: 'short' }),
        employees: count || 0,
      });
    }

    return NextResponse.json({
      stats: {
        totalEmployees: totalEmployees || 0,
        totalDepartments: totalDepartments || 0,
        activeProjects: activeProjects || 0,
        monthlyRevenue,
      },
      employeeGrowth,
      departmentDistribution,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];


