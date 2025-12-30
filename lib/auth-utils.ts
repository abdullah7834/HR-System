import { createClient } from '@/lib/supabase/server';

export interface UserRole {
  role_name: string;
  role_description: string | null;
  is_system_role: boolean;
}

export async function getUserRoles(): Promise<UserRole[]> {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    // Get employee record
    const { data: employee } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!employee) {
      return [];
    }

    // Get all roles for this employee
    const { data: roles } = await supabase
      .from('employee_roles')
      .select('role_name, role_description, is_system_role')
      .eq('employee_id', employee.id);

    return roles || [];
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
}

export function hasRole(userRoles: UserRole[], roleName: string): boolean {
  return userRoles.some(role => role.role_name === roleName);
}

export function hasAnyRole(userRoles: UserRole[], roleNames: string[]): boolean {
  return roleNames.some(roleName => hasRole(userRoles, roleName));
}

export function getPrimaryRole(userRoles: UserRole[]): string | null {
  // Priority: Admin > HR > Project Manager > Employee
  const priority = ['Admin', 'Super Admin', 'HR', 'HR Manager', 'Project Manager', 'Department Manager', 'Employee'];
  
  for (const priorityRole of priority) {
    if (hasRole(userRoles, priorityRole)) {
      return priorityRole;
    }
  }
  
  return userRoles[0]?.role_name || null;
}

