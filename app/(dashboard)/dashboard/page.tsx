import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserRoles, getPrimaryRole } from '@/lib/auth-utils';
import { EmployeeDashboard } from '@/components/dashboards/employee-dashboard';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';
import { HRDashboard } from '@/components/dashboards/hr-dashboard';
import { ProjectManagerDashboard } from '@/components/dashboards/project-manager-dashboard';
import { RecruiterDashboard } from '@/components/dashboards/recruiter-dashboard';

export default async function DashboardPage() {
  // Check authentication first
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user roles
  const userRoles = await getUserRoles();
  
  // If no roles, show employee dashboard as default (user might not have roles assigned yet)
  if (userRoles.length === 0) {
    return <EmployeeDashboard userRoles={[]} />;
  }

  const primaryRole = getPrimaryRole(userRoles);

  // Render dashboard based on primary role
  switch (primaryRole) {
    case 'Admin':
    case 'Super Admin':
      return <AdminDashboard userRoles={userRoles} />;
    case 'HR':
    case 'HR Manager':
      return <HRDashboard userRoles={userRoles} />;
    case 'Project Manager':
      return <ProjectManagerDashboard userRoles={userRoles} />;
    case 'Recruiter':
      return <RecruiterDashboard userRoles={userRoles} />;
    default:
      return <EmployeeDashboard userRoles={userRoles} />;
  }
}
