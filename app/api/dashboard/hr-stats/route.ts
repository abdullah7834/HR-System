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

    // Get total employees in accessible departments
    const { count: totalEmployees } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null]);

    // Get pending leaves
    const { count: pendingLeaves } = await supabase
      .from("leaves")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .in("employee_id", 
        await supabase
          .from("employees")
          .select("id")
          .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
          .then(res => res.data?.map(e => e.id) || [])
      );

    // Get active recruitments
    const { count: activeRecruitments } = await supabase
      .from("job_openings")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null]);

    // Get new hires this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);
    const { count: newHires } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
      .gte("created_at", monthStart.toISOString());

    // Get leave status distribution
    const { data: leaves } = await supabase
      .from("leaves")
      .select("status")
      .in("employee_id",
        await supabase
          .from("employees")
          .select("id")
          .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
          .then(res => res.data?.map(e => e.id) || [])
      );

    const leaveStatusData = [
      { name: 'Pending', value: leaves?.filter(l => l.status === 'pending').length || 0, color: '#f59e0b' },
      { name: 'Approved', value: leaves?.filter(l => l.status === 'approved').length || 0, color: '#22c55e' },
      { name: 'Rejected', value: leaves?.filter(l => l.status === 'rejected').length || 0, color: '#ef4444' },
    ];

    // Get department headcount
    const { data: departments } = await supabase
      .from("departments")
      .select("id, name")
      .in("id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null])
      .eq("is_active", true);

    const departmentHeadcount = await Promise.all(
      (departments || []).map(async (dept) => {
        const { count } = await supabase
          .from("employees")
          .select("*", { count: "exact", head: true })
          .eq("department_id", dept.id);
        return { name: dept.name, count: count || 0 };
      })
    );

    return NextResponse.json({
      stats: {
        totalEmployees: totalEmployees || 0,
        pendingLeaves: pendingLeaves || 0,
        activeRecruitments: activeRecruitments || 0,
        newHires: newHires || 0,
      },
      leaveStatusData,
      departmentHeadcount,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}


