import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Get current user's department ID
 * This replaces company-based filtering with department-based filtering
 * Uses admin client to avoid RLS recursion issues
 */
export async function getCurrentUserDepartment() {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Use admin client to avoid RLS recursion
    const adminClient = await createAdminClient();
    const { data: employee } = await adminClient
      .from('employees')
      .select('department_id')
      .eq('user_id', user.id)
      .single();

    return employee?.department_id || null;
  } catch (error) {
    console.error('Error fetching user department:', error);
    return null;
  }
}

/**
 * Get all department IDs that the user can access
 * For managers, this includes their department and sub-departments
 * Uses admin client to avoid RLS recursion issues
 */
export async function getAccessibleDepartmentIds() {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    // Use admin client to avoid RLS recursion when querying employees
    const adminClient = await createAdminClient();
    const { data: employee } = await adminClient
      .from('employees')
      .select('id, department_id')
      .eq('user_id', user.id)
      .single();

    if (!employee) {
      return [];
    }

    // Get user's roles to check permissions
    const { data: roles } = await adminClient
      .from('employee_roles')
      .select('role_name')
      .eq('employee_id', employee.id);

    const roleNames = roles?.map(r => r.role_name) || [];
    const isAdmin = roleNames.some(r => 
      ['super_admin', 'company_admin', 'Admin', 'Super Admin', 'HR', 'HR Manager'].includes(r)
    );

    // If admin/HR, return all departments (or filter by company if needed)
    if (isAdmin) {
      const { data: allDepartments } = await adminClient
        .from('departments')
        .select('id')
        .eq('is_active', true);
      
      return allDepartments?.map(d => d.id) || [];
    }

    // For managers, get their department and departments they manage
    const { data: managedDepartments } = await adminClient
      .from('departments')
      .select('id')
      .eq('manager_id', employee.id)
      .eq('is_active', true);

    const managedIds = managedDepartments?.map(d => d.id) || [];
    
    // Include their own department
    if (employee.department_id) {
      managedIds.push(employee.department_id);
    }

    return [...new Set(managedIds)];
  } catch (error) {
    console.error('Error fetching accessible departments:', error);
    return [];
  }
}

