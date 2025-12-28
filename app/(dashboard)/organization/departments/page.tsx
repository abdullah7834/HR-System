"use client";

import { useState, useEffect } from "react";
import { Plus, Users, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader, DataTable, Column, StatCard } from "@/components/shared";
import { AddDepartmentDialog } from "@/components/forms";

interface Department {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  manager?: {
    id: number;
    first_name: string;
    last_name: string;
    job_title: string;
  };
  company?: {
    name: string;
  };
  employeeCount?: number;
}

export default function DepartmentsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalDepartments: 0,
    totalEmployees: 0,
    avgTeamSize: 0,
  });

  useEffect(() => {
    fetchDepartments();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/departments/stats");
      const data = await response.json();

      if (response.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/departments");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch departments");
      }

      // Get employee counts for each department
      const departmentsWithCount = (data.departments || []).map(
        (dept: Department) => ({
          ...dept,
          employeeCount: 0, // Will be calculated from API
        })
      );

      setDepartments(departmentsWithCount);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentAdded = () => {
    fetchDepartments(); // Refresh the list
  };

  const columns: Column<Department>[] = [
    {
      id: "name",
      header: "Department",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <span className="font-medium text-sm">{row.name}</span>
            {row.description && (
              <p className="text-xs text-slate-500 mt-1 truncate max-w-xs">
                {row.description}...
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "manager",
      header: "Manager",
      cell: (row) => {
        if (!row.manager)
          return <span className="text-xs text-slate-400">Not assigned</span>;
        return (
          <div>
            <span className="text-sm font-medium">
              {row.manager.first_name} {row.manager.last_name}
            </span>
            <p className="text-xs text-slate-500">{row.manager.job_title}</p>
          </div>
        );
      },
    },
    {
      id: "employees",
      header: "Employees",
      cell: (row) => (
        <div className="flex items-center gap-1 text-sm">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          {row.employeeCount || 0}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded ${
            row.is_active
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
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
        <p className="text-red-600 mb-4">Error loading departments: {error}</p>
        <Button onClick={fetchDepartments}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Manage your organization's departments"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organization" },
          { label: "Departments" },
        ]}
        actions={
          <Button
            size="sm"
            className="h-8 text-xs"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Department
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard
          title="Total Departments"
          value={stats.totalDepartments}
          icon={Building2}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Avg. Team Size"
          value={stats.avgTeamSize}
          icon={Users}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* Table View */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="font-semibold text-sm text-slate-900">
            All Departments
          </h3>
        </div>
        <DataTable
          data={departments.map((dept) => ({ ...dept, id: String(dept.id) }))}
          columns={columns}
          searchPlaceholder="Search departments..."
        />
      </div>

      <AddDepartmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleDepartmentAdded}
      />
    </div>
  );
}
