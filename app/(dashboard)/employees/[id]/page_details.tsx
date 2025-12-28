"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EmployeeDetails {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  employment_type?: string;
  date_of_joining?: string;
  salary?: number;
  department_id?: number;
  gender?: string;
  address?: string;
  status: "Active" | "Inactive";
  created_at?: string;
  department?: {
    id: number;
    name: string;
  };
}

interface EmployeeRole {
  role_id: number;
  role?: {
    id: number;
    name: string;
  };
}

export default function EmployeeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id as string | undefined;

  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [roles, setRoles] = useState<EmployeeRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;
    fetchEmployeeData();
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    if (!employeeId) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/employees/${employeeId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch employee");
      }

      const { employee: empData, roles: empRoles } = data;
      setEmployee(empData);
      setRoles(empRoles || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error((error as Error).message);
      router.push("/employees");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Employee not found</p>
        <Button onClick={() => router.push("/employees")}>
          Back to Employees
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Employee ID: {employee.employee_code}
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/employees/${employee.id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Employee
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">First Name</p>
                  <p className="text-base font-medium text-slate-900">
                    {employee.first_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Last Name</p>
                  <p className="text-base font-medium text-slate-900">
                    {employee.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Email</p>
                  <p className="text-base font-medium text-slate-900">
                    {employee.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Phone</p>
                  <p className="text-base font-medium text-slate-900">
                    {employee.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Employment Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Job Title</p>
                  <p className="text-base font-medium text-slate-900">
                    {employee.job_title || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Employment Type</p>
                  <p className="text-base font-medium text-slate-900">
                    {employee.employment_type || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Date of Joining</p>
                  <p className="text-base font-medium text-slate-900">
                    {employee.date_of_joining
                      ? new Date(employee.date_of_joining).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Salary</p>
                  <p className="text-base font-medium text-slate-900">
                    {employee.salary
                      ? `$${employee.salary.toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Gender</p>
                  <p className="text-base font-medium text-slate-900">
                    {employee.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Address</p>
                  <p className="text-base font-medium text-slate-900 whitespace-pre-wrap">
                    {employee.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Status
              </h3>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  employee.status === "Active"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {employee.status}
              </div>
            </div>

            {/* Department Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Department
              </h3>
              <p className="text-base font-medium text-slate-900">
                {employee.department?.name || "N/A"}
              </p>
            </div>

            {/* Roles Card */}
            {roles.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Roles
                </h3>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div
                      key={role.role_id}
                      className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded mr-2 mb-2 font-medium"
                    >
                      {role.role?.name || "Unknown Role"}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Created Date */}
            {employee.created_at && (
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Created
                </h3>
                <p className="text-sm text-slate-600">
                  {new Date(employee.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
