"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Users,
  UserCheck,
  UserX,
  Loader2,
  MoreVertical,
  Edit,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader, StatCard, DataTable, Column } from "@/components/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { AddEmployeeDialog } from "@/components/forms/add-employee-dialog";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  employment_type?: string;
  status: "Active" | "Inactive";
  date_of_joining?: string;
  employee_code?: string;
  role?: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  company?: {
    name: string;
  };
}

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/employees");
      const data = await response.json();
      console.log("data", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch employees");
      }

      setEmployees(data.employees || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (
    employeeId: number,
    currentStatus: "Active" | "Inactive"
  ) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setUpdatingId(employeeId);
    try {
      const response = await fetch("/api/employees/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // Update the employee in the list
      setEmployees(
        employees.map((emp) =>
          emp.id === employeeId ? { ...emp, status: newStatus } : emp
        )
      );

      toast.success(
        `Employee ${
          newStatus === "Active" ? "activated" : "deactivated"
        } successfully`
      );
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  const columns: Column<Employee>[] = [
    {
      id: "name",
      header: "Employee",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">
              {row.first_name[0]}
              {row.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm text-slate-900">
              {row.first_name} {row.last_name}
            </p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: "department",
      header: "Department",
      cell: (row) => (
        <span className="text-sm text-slate-600">
          {row.department?.name || "N/A"}
        </span>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (row) => (
        <span className="text-sm text-slate-600">
          {row.role?.name || "N/A"}
        </span>
      ),
    },
    {
      id: "employee_code",
      header: "Employee Code",
      cell: (row) => (
        <span className="text-sm text-slate-600 font-mono">
          {row.employee_code || "N/A"}
        </span>
      ),
    },
    {
      id: "employment_type",
      header: "Type",
      cell: (row) => (
        <span className="text-sm text-slate-600">
          {row.employment_type || "N/A"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded ${
            row.status === "Active"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {updatingId === row.id ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => router.push(`/employees/${row.id}`)}
                  className="cursor-pointer"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/employees/${row.id}/edit`)}
                  className="cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Employee
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {row.status === "Active" ? (
                  <DropdownMenuItem
                    onClick={() => handleStatusToggle(row.id, row.status)}
                    className="cursor-pointer text-amber-600"
                  >
                    Deactivate Employee
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleStatusToggle(row.id, row.status)}
                    className="cursor-pointer text-green-600"
                  >
                    Activate Employee
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading employees: {error}</p>
        <Button onClick={fetchEmployees}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage your organization's employees"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Employees" },
        ]}
        actions={
          <Button
            size="sm"
            className="h-8 text-xs"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Employee
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Active"
          value={employees.filter((e) => e.status === "Active").length}
          icon={UserCheck}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Inactive"
          value={employees.filter((e) => e.status === "Inactive").length}
          icon={UserX}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
        />
        <StatCard
          title="This Month"
          value={
            employees.filter((e) => {
              if (!e.date_of_joining) return false;
              const joinDate = new Date(e.date_of_joining);
              const now = new Date();
              return (
                joinDate.getMonth() === now.getMonth() &&
                joinDate.getFullYear() === now.getFullYear()
              );
            }).length
          }
          icon={Users}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <DataTable
          data={employees}
          columns={columns}
          searchPlaceholder="Search employees..."
        />
      </div>

      <AddEmployeeDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={fetchEmployees}
      />
    </div>
  );
}
