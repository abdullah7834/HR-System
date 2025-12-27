import { 
  User, Employee, LeaveRequest, Task, Candidate, 
  JobOpening, Project, Notification, AttendanceRecord,
  Company, Department
} from '@/types';

export const currentUser: User = {
  id: '1',
  email: 'sarah.miller@company.com',
  firstName: 'Sarah',
  lastName: 'Miller',
  avatar: '/avatars/sarah.jpg',
  role: 'hr_manager',
  department: 'Human Resources',
  position: 'HR Manager',
};

export const employees: Employee[] = [
  { id: '1', firstName: 'Sarah', lastName: 'Miller', email: 'sarah@company.com', department: 'Engineering', position: 'Senior Developer', status: 'active', joinDate: '2023-01-15' },
  { id: '2', firstName: 'John', lastName: 'Davis', email: 'john@company.com', department: 'Marketing', position: 'Marketing Manager', status: 'active', joinDate: '2022-06-20' },
  { id: '3', firstName: 'Emma', lastName: 'Wilson', email: 'emma@company.com', department: 'Design', position: 'UI Designer', status: 'on_leave', joinDate: '2023-03-10' },
  { id: '4', firstName: 'Mike', lastName: 'Brown', email: 'mike@company.com', department: 'Engineering', position: 'DevOps Engineer', status: 'active', joinDate: '2022-11-05' },
  { id: '5', firstName: 'Anna', lastName: 'Lee', email: 'anna@company.com', department: 'HR', position: 'Recruiter', status: 'active', joinDate: '2023-05-22' },
  { id: '6', firstName: 'Tom', lastName: 'Smith', email: 'tom@company.com', department: 'Finance', position: 'Accountant', status: 'inactive', joinDate: '2021-09-15' },
  { id: '7', firstName: 'Lisa', lastName: 'Johnson', email: 'lisa@company.com', department: 'Engineering', position: 'Frontend Developer', status: 'active', joinDate: '2023-07-01' },
  { id: '8', firstName: 'David', lastName: 'Chen', email: 'david@company.com', department: 'Engineering', position: 'Backend Developer', status: 'active', joinDate: '2023-02-14' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: '1', employeeId: '1', employeeName: 'Sarah Miller', type: 'Annual Leave', startDate: '2024-12-28', endDate: '2024-12-30', days: 3, reason: 'Family vacation', status: 'pending', appliedAt: '2024-12-20' },
  { id: '2', employeeId: '2', employeeName: 'John Davis', type: 'Sick Leave', startDate: '2024-12-27', endDate: '2024-12-27', days: 1, reason: 'Not feeling well', status: 'pending', appliedAt: '2024-12-26' },
  { id: '3', employeeId: '3', employeeName: 'Emma Wilson', type: 'Personal Leave', startDate: '2025-01-02', endDate: '2025-01-03', days: 2, reason: 'Personal matters', status: 'pending', appliedAt: '2024-12-25' },
  { id: '4', employeeId: '4', employeeName: 'Mike Brown', type: 'Annual Leave', startDate: '2024-12-20', endDate: '2024-12-22', days: 3, reason: 'Holiday trip', status: 'approved', appliedAt: '2024-12-15' },
];

export const tasks: Task[] = [
  { id: '1', title: 'Design Homepage', projectId: '1', assigneeId: '3', assigneeName: 'Emma Wilson', status: 'todo', priority: 'high', dueDate: '2024-12-28' },
  { id: '2', title: 'Implement Auth Flow', projectId: '1', assigneeId: '1', assigneeName: 'Sarah Miller', status: 'in_progress', priority: 'high', dueDate: '2024-12-30' },
  { id: '3', title: 'Code Review Dashboard', projectId: '1', assigneeId: '4', assigneeName: 'Mike Brown', status: 'review', priority: 'medium', dueDate: '2024-12-27' },
  { id: '4', title: 'Setup CI/CD Pipeline', projectId: '1', assigneeId: '4', assigneeName: 'Mike Brown', status: 'done', priority: 'high', dueDate: '2024-12-25' },
  { id: '5', title: 'Create API Endpoints', projectId: '1', assigneeId: '8', assigneeName: 'David Chen', status: 'in_progress', priority: 'high', dueDate: '2024-12-29' },
  { id: '6', title: 'Write Unit Tests', projectId: '1', assigneeId: '7', assigneeName: 'Lisa Johnson', status: 'todo', priority: 'medium', dueDate: '2025-01-02' },
  { id: '7', title: 'Update Documentation', projectId: '1', assigneeId: '1', assigneeName: 'Sarah Miller', status: 'todo', priority: 'low', dueDate: '2025-01-05' },
  { id: '8', title: 'Performance Optimization', projectId: '1', assigneeId: '8', assigneeName: 'David Chen', status: 'todo', priority: 'medium', dueDate: '2025-01-10' },
];

export const candidates: Candidate[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@email.com', position: 'Senior Frontend', stage: 'applied', rating: 4, source: 'LinkedIn', appliedAt: '2024-12-20' },
  { id: '2', name: 'Sarah Davis', email: 'sarah.d@email.com', position: 'Product Designer', stage: 'screening', rating: 5, source: 'Referral', appliedAt: '2024-12-18' },
  { id: '3', name: 'Mike Wilson', email: 'mike.w@email.com', position: 'Backend Developer', stage: 'interview', rating: 4, source: 'Indeed', appliedAt: '2024-12-15' },
  { id: '4', name: 'Emma Brown', email: 'emma.b@email.com', position: 'Marketing Manager', stage: 'offer', rating: 5, source: 'Website', appliedAt: '2024-12-10' },
  { id: '5', name: 'Tom Kennedy', email: 'tom.k@email.com', position: 'DevOps Engineer', stage: 'hired', rating: 5, source: 'LinkedIn', appliedAt: '2024-12-05' },
  { id: '6', name: 'Anna Lee', email: 'anna.l@email.com', position: 'Senior Frontend', stage: 'applied', rating: 3, source: 'Indeed', appliedAt: '2024-12-22' },
  { id: '7', name: 'James Miller', email: 'james.m@email.com', position: 'Senior Frontend', stage: 'screening', rating: 4, source: 'Referral', appliedAt: '2024-12-19' },
  { id: '8', name: 'Lisa Chen', email: 'lisa.c@email.com', position: 'Backend Developer', stage: 'interview', rating: 5, source: 'LinkedIn', appliedAt: '2024-12-12' },
];

export const jobOpenings: JobOpening[] = [
  { id: '1', title: 'Senior Frontend Developer', department: 'Engineering', location: 'San Francisco', type: 'full_time', status: 'open', applicantCount: 45, postedAt: '2024-12-15' },
  { id: '2', title: 'Product Designer', department: 'Design', location: 'Remote', type: 'full_time', status: 'open', applicantCount: 32, postedAt: '2024-12-10' },
  { id: '3', title: 'DevOps Engineer', department: 'Engineering', location: 'New York', type: 'full_time', status: 'paused', applicantCount: 28, postedAt: '2024-12-05' },
  { id: '4', title: 'Marketing Manager', department: 'Marketing', location: 'San Francisco', type: 'full_time', status: 'open', applicantCount: 15, postedAt: '2024-12-01' },
];

export const projects: Project[] = [
  { id: '1', name: 'Website Redesign', description: 'Complete overhaul of company website', status: 'active', progress: 78, dueDate: '2025-01-15', teamMembers: ['1', '3', '7', '8'] },
  { id: '2', name: 'Mobile App v2', description: 'Second version of mobile application', status: 'active', progress: 45, dueDate: '2025-02-01', teamMembers: ['1', '4', '8'] },
  { id: '3', name: 'API Integration', description: 'Third-party API integrations', status: 'completed', progress: 100, dueDate: '2024-12-20', teamMembers: ['4', '8'] },
  { id: '4', name: 'Dashboard Update', description: 'Analytics dashboard improvements', status: 'active', progress: 25, dueDate: '2025-01-30', teamMembers: ['3', '7'] },
];

export const notifications: Notification[] = [
  { id: '1', title: 'Leave Approved', message: 'Your leave request for Dec 20-22 has been approved', type: 'success', read: false, createdAt: '2024-12-26T10:30:00' },
  { id: '2', title: 'New Task Assigned', message: 'You have been assigned to "Design Homepage"', type: 'info', read: false, createdAt: '2024-12-26T09:15:00' },
  { id: '3', title: 'Performance Review', message: 'Your Q4 performance review is scheduled for Jan 5', type: 'warning', read: false, createdAt: '2024-12-25T14:00:00' },
  { id: '4', title: 'Payslip Available', message: 'Your December payslip is now available', type: 'info', read: true, createdAt: '2024-12-24T08:00:00' },
];

export const companies: Company[] = [
  { id: '1', name: 'Acme Corporation', employeeCount: 245, status: 'active', plan: 'enterprise', createdAt: '2023-01-15' },
  { id: '2', name: 'TechStart Inc', employeeCount: 52, status: 'active', plan: 'pro', createdAt: '2023-06-20' },
  { id: '3', name: 'Global Solutions Ltd', employeeCount: 890, status: 'trial', plan: 'enterprise', createdAt: '2024-11-01' },
  { id: '4', name: 'StartupXYZ', employeeCount: 18, status: 'active', plan: 'starter', createdAt: '2024-09-15' },
];

export const departments: Department[] = [
  { id: '1', name: 'Engineering', employeeCount: 45, companyId: '1' },
  { id: '2', name: 'Marketing', employeeCount: 12, companyId: '1' },
  { id: '3', name: 'Design', employeeCount: 8, companyId: '1' },
  { id: '4', name: 'Human Resources', employeeCount: 5, companyId: '1' },
  { id: '5', name: 'Finance', employeeCount: 6, companyId: '1' },
  { id: '6', name: 'Sales', employeeCount: 15, companyId: '1' },
];

export const attendanceData: AttendanceRecord[] = Array.from({ length: 31 }, (_, i) => ({
  id: `att-${i + 1}`,
  employeeId: '1',
  date: `2024-12-${String(i + 1).padStart(2, '0')}`,
  clockIn: i % 7 === 0 || i % 7 === 6 ? undefined : '09:00',
  clockOut: i % 7 === 0 || i % 7 === 6 ? undefined : '18:00',
  status: i % 7 === 0 || i % 7 === 6 ? 'holiday' : i === 24 ? 'on_leave' : Math.random() > 0.1 ? 'present' : 'late',
  workingHours: i % 7 === 0 || i % 7 === 6 ? 0 : 8,
}));

// Dashboard Stats
export const dashboardStats = {
  superAdmin: {
    totalCompanies: 24,
    totalUsers: 1847,
    systemErrors: 3,
    uptime: 99.9,
    activeNow: 156,
  },
  companyAdmin: {
    totalEmployees: 156,
    pendingApprovals: 12,
    onLeaveToday: 8,
    payrollAmount: 45200,
    openJobs: 5,
  },
  hrManager: {
    pendingLeaves: 15,
    attendanceRate: 94,
    upcomingInterviews: 8,
    overdueReviews: 3,
  },
  recruiter: {
    openJobs: 8,
    totalApplicants: 156,
    scheduledInterviews: 12,
    pendingOffers: 5,
    hiredThisQuarter: 23,
  },
  projectManager: {
    activeProjects: 12,
    completedTasks: 45,
    inProgressTasks: 23,
    overdueTasks: 8,
    teamMembers: 24,
  },
  employee: {
    leaveBalance: { annual: 12, sick: 8, personal: 2 },
    pendingTasks: 5,
    upcomingTraining: 2,
    unreadNotifications: 3,
  },
};
