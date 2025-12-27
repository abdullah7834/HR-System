'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar 
        open={sidebarOpen} 
        onOpenChange={setSidebarOpen}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className={cn(
        'transition-all duration-200',
        sidebarCollapsed ? 'lg:ml-[60px]' : 'lg:ml-52'
      )}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
