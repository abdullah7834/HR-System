'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, FolderKanban, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader, StatCard } from '@/components/shared';
import { projects, employees } from '@/lib/mock-data';

export default function ProjectsPage() {
  const router = useRouter();

  const getTeamMembers = (memberIds: string[]) => {
    return memberIds.map(id => employees.find(e => e.id === id)).filter(Boolean);
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage and track your team's projects"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Projects' }]}
        actions={
          <Link href="/projects/new">
            <Button size="sm" className="h-8 text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> New Project</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Active" value={projects.filter(p => p.status === 'active').length} icon={FolderKanban} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="Completed" value={projects.filter(p => p.status === 'completed').length} icon={FolderKanban} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="On Hold" value={projects.filter(p => p.status === 'on_hold').length} icon={FolderKanban} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
        <StatCard title="Team Members" value={new Set(projects.flatMap(p => p.teamMembers)).size} icon={Users} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project) => {
          const members = getTeamMembers(project.teamMembers);
          return (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-slate-100 p-4 cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-slate-900">{project.name}</h3>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  project.status === 'completed' ? 'bg-green-50 text-green-700' :
                  project.status === 'active' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                }`}>{project.status}</span>
              </div>
              {project.description && (
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{project.description}</p>
              )}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-medium text-slate-700">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  {members.slice(0, 3).map((member, idx) => (
                    <Avatar key={idx} className="h-6 w-6 border-2 border-white">
                      <AvatarImage src={member?.avatar} />
                      <AvatarFallback className="text-[9px] bg-slate-100">{member?.firstName[0]}{member?.lastName[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {members.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-medium text-slate-600">
                      +{members.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="h-3 w-3" />
                  {new Date(project.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
