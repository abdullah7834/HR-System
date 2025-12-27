'use client';

import { useState } from 'react';
import { Calendar, Filter, TrendingUp, TrendingDown, Users, Briefcase, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { currentUser } from '@/lib/mock-data';

// Chart data
const candidateStats = [
  { day: '1', responses: 4, hired: 1 },
  { day: '2', responses: 6, hired: 2 },
  { day: '3', responses: 8, hired: 1 },
  { day: '4', responses: 5, hired: 2 },
  { day: '5', responses: 3, hired: 1 },
  { day: '6', responses: 2, hired: 0 },
  { day: '7', responses: 1, hired: 0 },
  { day: '8', responses: 7, hired: 2 },
  { day: '9', responses: 9, hired: 3 },
  { day: '10', responses: 6, hired: 2 },
  { day: '11', responses: 8, hired: 2 },
  { day: '12', responses: 5, hired: 1 },
  { day: '13', responses: 4, hired: 1 },
  { day: '14', responses: 3, hired: 0 },
  { day: '15', responses: 2, hired: 0 },
  { day: '16', responses: 10, hired: 3 },
  { day: '17', responses: 12, hired: 4 },
  { day: '18', responses: 8, hired: 2 },
  { day: '19', responses: 6, hired: 2 },
  { day: '20', responses: 5, hired: 1 },
  { day: '21', responses: 4, hired: 1 },
  { day: '22', responses: 3, hired: 0 },
  { day: '23', responses: 14, hired: 5 },
  { day: '24', responses: 16, hired: 6 },
  { day: '25', responses: 11, hired: 4 },
  { day: '26', responses: 8, hired: 2 },
  { day: '27', responses: 6, hired: 2 },
  { day: '28', responses: 4, hired: 1 },
  { day: '29', responses: 3, hired: 1 },
  { day: '30', responses: 2, hired: 0 },
];

const sourceData = [
  { name: 'LinkedIn', value: 685, color: '#3b82f6' },
  { name: 'Indeed', value: 294, color: '#22c55e' },
  { name: 'Referral', value: 168, color: '#f59e0b' },
  { name: 'Career Page', value: 88, color: '#8b5cf6' },
  { name: 'Other', value: 105, color: '#64748b' },
];

const recruiters = [
  { id: '1', name: 'John Smith', avatar: '', vacancies: 8, responses: 283, change: 36, hired: '8 of 10', rate: 80 },
  { id: '2', name: 'Sarah Miller', avatar: '', vacancies: 3, responses: 280, change: 42, hired: '2 of 4', rate: 50 },
  { id: '3', name: 'Mike Johnson', avatar: '', vacancies: 5, responses: 195, change: 28, hired: '4 of 6', rate: 67 },
];

const closingTimes = [
  { name: 'John Smith', days: 5 },
  { name: 'Jacob Bold', days: 7 },
  { name: 'Anna Walker', days: 12 },
  { name: 'Helga Miller', days: 12 },
  { name: 'Michael Brown', days: 14 },
  { name: 'Elena Harris', days: 16 },
];

export default function DashboardPage() {
  const [period, setPeriod] = useState('december-2024');
  const totalSource = sourceData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <Calendar className="h-3.5 w-3.5 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="december-2024">December, 2024</SelectItem>
            <SelectItem value="november-2024">November, 2024</SelectItem>
            <SelectItem value="october-2024">October, 2024</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40 h-8 text-xs">
            <Filter className="h-3.5 w-3.5 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Total responses</span>
            <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +15%
            </span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">2,436</p>
          <p className="text-[10px] text-slate-400 mt-0.5">of candidates for the period</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Responses today</span>
            <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingDown className="h-3 w-3" /> -10%
            </span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">98</p>
          <p className="text-[10px] text-slate-400 mt-0.5">candidates left a response</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Total vacancies</span>
            <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingDown className="h-3 w-3" /> -10%
            </span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">49</p>
          <p className="text-[10px] text-slate-400 mt-0.5">active and closed vacancies</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Closed vacancies</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">18 <span className="text-sm font-normal text-slate-400">out of 49</span></p>
          <Progress value={37} className="h-1.5 mt-2" />
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Recruitment plan</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">20 <span className="text-sm font-normal text-slate-400">out of 61</span></p>
          <Progress value={33} className="h-1.5 mt-2" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-900">Candidate statistics</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-200" />
                <span className="text-slate-500">Received responses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-500">Candidates hired</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={candidateStats} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="responses" fill="#bfdbfe" radius={[2, 2, 0, 0]} />
                <Bar dataKey="hired" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Candidate Source</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-900">{totalSource}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {sourceData.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-xs text-slate-700">{source.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{source.value} responses</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recruiters Table */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="text-sm font-medium text-slate-900">Recruiters rating</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-400 uppercase">Recruiter</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-400 uppercase">Active vacancies</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-400 uppercase">Responses</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-400 uppercase">Hired</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-400 uppercase">Rate</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">{r.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-900">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-slate-600">{r.vacancies}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-sm text-slate-600">{r.responses}</span>
                      <span className="text-xs text-green-600 ml-1">+{r.change}</span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-slate-600">{r.hired}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${r.rate}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{r.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vacancy Closing Time */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="text-sm font-medium text-slate-900">Average vacancy closing time</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {closingTimes.map((person) => (
                <div key={person.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600">{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-700">{person.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">{person.days}</p>
                    <p className="text-[10px] text-slate-400">days</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
