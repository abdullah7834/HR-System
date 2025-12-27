import { Role } from '@/types';

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: number;
  children?: NavItem[];
  roles?: Role[];
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
    ],
  },
  {
    label: 'Organization',
    items: [
      {
        id: 'organization',
        label: 'Organization',
        icon: 'Building2',
        roles: ['super_admin', 'company_admin', 'hr_manager'],
        children: [
          { id: 'companies', label: 'Companies', href: '/organization/companies', roles: ['super_admin'] },
          { id: 'departments', label: 'Departments', href: '/organization/departments' },
          { id: 'roles', label: 'Roles & Permissions', href: '/organization/roles' },
        ],
      },
      { id: 'employees', label: 'Employees', icon: 'Users', href: '/employees', roles: ['super_admin', 'company_admin', 'hr_manager', 'recruiter'] },
    ],
  },
  {
    label: 'Work Management',
    items: [
      { id: 'projects', label: 'Projects', icon: 'FolderKanban', href: '/projects', roles: ['super_admin', 'company_admin', 'project_manager', 'employee'] },
      { id: 'tasks', label: 'Tasks', icon: 'CheckSquare', href: '/tasks', roles: ['super_admin', 'company_admin', 'hr_manager', 'project_manager', 'employee'] },
      { id: 'chat', label: 'Team Chat', icon: 'MessageCircle', href: '/chat' },
    ],
  },
  {
    label: 'Time & Attendance',
    items: [
      { id: 'attendance', label: 'Attendance', icon: 'Clock', href: '/attendance' },
      { id: 'leaves', label: 'Leaves', icon: 'Palmtree', href: '/leaves' },
      { id: 'holidays', label: 'Holidays', icon: 'Calendar', href: '/holidays' },
    ],
  },
  {
    label: 'Payroll',
    items: [
      { id: 'payroll', label: 'Payroll', icon: 'DollarSign', href: '/payroll', roles: ['super_admin', 'company_admin', 'hr_manager'] },
      { id: 'payslips', label: 'Payslips', icon: 'FileText', href: '/payslips' },
    ],
  },
  {
    label: 'Recruitment',
    items: [
      {
        id: 'recruitment',
        label: 'Recruitment',
        icon: 'Briefcase',
        roles: ['super_admin', 'company_admin', 'hr_manager', 'recruiter'],
        children: [
          { id: 'jobs', label: 'Job Openings', href: '/recruitment/jobs' },
          { id: 'applicants', label: 'Applicants', href: '/recruitment/applicants' },
          { id: 'interviews', label: 'Interviews', href: '/recruitment/interviews' },
          { id: 'stages', label: 'Pipeline Stages', href: '/recruitment/stages' },
        ],
      },
    ],
  },
  {
    label: 'Performance & Training',
    items: [
      {
        id: 'performance',
        label: 'Performance',
        icon: 'TrendingUp',
        children: [
          { id: 'kpis', label: 'KPIs', href: '/performance/kpis', roles: ['super_admin', 'company_admin', 'hr_manager'] },
          { id: 'reviews', label: 'Reviews', href: '/performance/reviews' },
        ],
      },
      {
        id: 'training',
        label: 'Training',
        icon: 'GraduationCap',
        children: [
          { id: 'programs', label: 'Programs', href: '/training/programs' },
          { id: 'my-training', label: 'My Training', href: '/training/my' },
        ],
      },
    ],
  },
  {
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'Bell', href: '/notifications', badge: 3 },
      { id: 'settings', label: 'Settings', icon: 'Settings', href: '/settings' },
    ],
  },
];

export function filterNavigationByRole(role: Role): NavSection[] {
  return navigation.map(section => ({
    ...section,
    items: section.items
      .filter(item => !item.roles || item.roles.includes(role))
      .map(item => ({
        ...item,
        children: item.children?.filter(child => !child.roles || child.roles.includes(role)),
      })),
  })).filter(section => section.items.length > 0);
}
