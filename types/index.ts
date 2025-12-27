// User & Auth Types
export type Role = 'super_admin' | 'company_admin' | 'hr_manager' | 'recruiter' | 'project_manager' | 'employee';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: Role;
  department?: string;
  position?: string;
  companyId?: string;
}

// Organization Types
export interface Company {
  id: string;
  name: string;
  logo?: string;
  employeeCount: number;
  status: 'active' | 'inactive' | 'trial';
  plan: 'starter' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
  employeeCount: number;
  companyId: string;
}

// Employee Types
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  managerId?: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'holiday';
  workingHours?: number;
}

// Leave Types
export interface LeaveType {
  id: string;
  name: string;
  daysAllowed: number;
  color: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

// Payroll Types
export interface Payslip {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
}

// Recruitment Types
export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'remote';
  status: 'open' | 'paused' | 'closed';
  applicantCount: number;
  postedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  position: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  rating: number;
  source: string;
  appliedAt: string;
}

// Project & Task Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on_hold';
  progress: number;
  dueDate: string;
  teamMembers: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// Performance Types
export interface KPI {
  id: string;
  name: string;
  description?: string;
  target: number;
  unit: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  rating: number;
  status: 'draft' | 'submitted' | 'completed';
  createdAt: string;
}

// Training Types
export interface TrainingProgram {
  id: string;
  name: string;
  description?: string;
  duration: string;
  startDate: string;
  participantCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  badge?: number;
  children?: NavItem[];
  roles?: Role[];
}
