"use client";

import { useEffect, useState } from "react";
import { Plus, Building2, Users, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, DataTable, Column, StatCard } from "@/components/shared";

interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  country?: string;
  timezone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/companies");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch companies");
      }

      setCompanies(data.companies || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Company>[] = [
    {
      id: "name",
      header: "Company",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email || "No email"}</p>
          </div>
        </div>
      ),
    },
    {
      id: "country",
      header: "Location",
      cell: (row) => (
        <div className="flex items-center gap-1 text-slate-500">
          <MapPin className="h-3 w-3" />
          {row.country || "Not specified"}
        </div>
      ),
    },
    {
      id: "is_active",
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
    {
      id: "created_at",
      header: "Created",
      cell: (row) => (
        <span className="text-slate-600 text-sm">
          {new Date(row.created_at).toLocaleDateString()}
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
        <p className="text-red-600 mb-4">Error loading companies: {error}</p>
        <Button onClick={fetchCompanies}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Manage registered companies"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organization" },
          { label: "Companies" },
        ]}
        actions={
          <Button size="sm" className="h-8 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Company
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard
          title="Total Companies"
          value={companies.length}
          icon={Building2}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Active"
          value={companies.filter((c) => c.is_active).length}
          icon={Building2}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Countries"
          value={new Set(companies.map((c) => c.country).filter(Boolean)).size}
          icon={MapPin}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatCard
          title="This Month"
          value={
            companies.filter(
              (c) => new Date(c.created_at).getMonth() === new Date().getMonth()
            ).length
          }
          icon={Building2}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <DataTable
          data={companies}
          columns={columns}
          searchPlaceholder="Search companies..."
        />
      </div>
    </div>
  );
}
