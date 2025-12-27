'use client';

import { Download, FileText, Calendar, DollarSign, TrendingDown, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, DataTable, Column, StatCard } from '@/components/shared';
import { toast } from 'sonner';

interface PayslipRecord {
  id: string;
  month: string;
  year: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'paid' | 'pending';
  paidDate?: string;
}

const payslips: PayslipRecord[] = [
  { id: '1', month: 'December', year: 2024, grossPay: 5620, deductions: 1846, netPay: 3774, status: 'paid', paidDate: '2024-12-25' },
  { id: '2', month: 'November', year: 2024, grossPay: 5500, deductions: 1800, netPay: 3700, status: 'paid', paidDate: '2024-11-25' },
  { id: '3', month: 'October', year: 2024, grossPay: 5500, deductions: 1800, netPay: 3700, status: 'paid', paidDate: '2024-10-25' },
  { id: '4', month: 'September', year: 2024, grossPay: 5500, deductions: 1800, netPay: 3700, status: 'paid', paidDate: '2024-09-25' },
  { id: '5', month: 'August', year: 2024, grossPay: 5500, deductions: 1800, netPay: 3700, status: 'paid', paidDate: '2024-08-25' },
  { id: '6', month: 'July', year: 2024, grossPay: 5500, deductions: 1800, netPay: 3700, status: 'paid', paidDate: '2024-07-25' },
];

export default function PayslipsPage() {
  const handleDownload = (id: string) => {
    toast.success('Downloading payslip...');
  };

  const columns: Column<PayslipRecord>[] = [
    {
      id: 'period',
      header: 'Period',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-sm">{row.month} {row.year}</span>
        </div>
      ),
    },
    {
      id: 'grossPay',
      header: 'Gross Pay',
      cell: (row) => <span className="text-sm">${row.grossPay.toLocaleString()}</span>,
    },
    {
      id: 'deductions',
      header: 'Deductions',
      cell: (row) => (
        <span className="text-sm text-red-600">-${row.deductions.toLocaleString()}</span>
      ),
    },
    {
      id: 'netPay',
      header: 'Net Pay',
      cell: (row) => (
        <span className="font-semibold text-sm text-green-600">${row.netPay.toLocaleString()}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge 
          variant="outline"
          className={`text-[10px] h-5 ${
            row.status === 'paid' 
              ? 'border-green-200 text-green-600 bg-green-50' 
              : 'border-amber-200 text-amber-600 bg-amber-50'
          }`}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'paidDate',
      header: 'Paid Date',
      cell: (row) => <span className="text-xs text-slate-500">{row.paidDate ? new Date(row.paidDate).toLocaleDateString() : '-'}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(row.id);
          }}
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          Download
        </Button>
      ),
    },
  ];

  const latestPayslip = payslips[0];

  return (
    <div>
      <PageHeader
        title="Payslips"
        description="View and download your payslips"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Payslips' },
        ]}
      />

      {/* Latest Payslip Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-slate-500" />
          <h3 className="font-semibold text-sm text-slate-900">Latest Payslip - {latestPayslip.month} {latestPayslip.year}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Gross Pay"
            value={`$${latestPayslip.grossPay.toLocaleString()}`}
            icon={DollarSign}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
          />
          <StatCard
            title="Deductions"
            value={`-$${latestPayslip.deductions.toLocaleString()}`}
            icon={TrendingDown}
            iconColor="text-red-600"
            iconBgColor="bg-red-50"
          />
          <StatCard
            title="Net Pay"
            value={`$${latestPayslip.netPay.toLocaleString()}`}
            icon={Wallet}
            iconColor="text-green-600"
            iconBgColor="bg-green-50"
          />
          <div className="bg-white rounded-lg p-4 border border-slate-200 flex items-center justify-center">
            <Button size="sm" className="h-8 text-xs" onClick={() => handleDownload(latestPayslip.id)}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Payslip History */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="font-semibold text-sm text-slate-900">Payslip History</h3>
        </div>
        <DataTable
          data={payslips}
          columns={columns}
          searchable={false}
        />
      </div>
    </div>
  );
}
