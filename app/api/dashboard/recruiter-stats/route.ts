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

    // Get active jobs
    const { count: activeJobs } = await supabase
      .from("job_openings")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null]);

    // Get total applicants
    const { data: jobIds } = await supabase
      .from("job_openings")
      .select("id")
      .in("department_id", accessibleDeptIds.length > 0 ? accessibleDeptIds : [null]);

    const { count: totalApplicants } = await supabase
      .from("job_applicants")
      .select("*", { count: "exact", head: true })
      .in("job_opening_id", jobIds?.map(j => j.id) || []);

    // Get scheduled interviews
    const { count: interviewsScheduled } = await supabase
      .from("interviews")
      .select("*", { count: "exact", head: true })
      .in("applicant_id",
        await supabase
          .from("job_applicants")
          .select("id")
          .in("job_opening_id", jobIds?.map(j => j.id) || [])
          .then(res => res.data?.map(a => a.id) || [])
      )
      .eq("result", "pending")
      .gte("scheduled_at", new Date().toISOString());

    // Get hired this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);
    const { count: hiredThisMonth } = await supabase
      .from("job_applicants")
      .select("*", { count: "exact", head: true })
      .in("job_opening_id", jobIds?.map(j => j.id) || [])
      .eq("status", "hired")
      .gte("applied_at", monthStart.toISOString());

    // Get applicant source data
    const { data: applicants } = await supabase
      .from("job_applicants")
      .select("source")
      .in("job_opening_id", jobIds?.map(j => j.id) || []);

    const sourceCounts: Record<string, number> = {};
    applicants?.forEach(a => {
      const source = a.source || 'Other';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    const applicantSourceData = Object.entries(sourceCounts).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }));

    // Get pipeline data
    const { data: pipelineStages } = await supabase
      .from("job_applicants")
      .select("status")
      .in("job_opening_id", jobIds?.map(j => j.id) || []);

    const pipelineData = [
      { stage: 'Applied', count: pipelineStages?.filter(p => p.status === 'applied').length || 0 },
      { stage: 'Screening', count: pipelineStages?.filter(p => p.status === 'screening').length || 0 },
      { stage: 'Interview', count: pipelineStages?.filter(p => p.status === 'interview').length || 0 },
      { stage: 'Offer', count: pipelineStages?.filter(p => p.status === 'offer').length || 0 },
      { stage: 'Hired', count: pipelineStages?.filter(p => p.status === 'hired').length || 0 },
    ];

    return NextResponse.json({
      stats: {
        activeJobs: activeJobs || 0,
        totalApplicants: totalApplicants || 0,
        interviewsScheduled: interviewsScheduled || 0,
        hiredThisMonth: hiredThisMonth || 0,
      },
      applicantSourceData,
      pipelineData,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];


