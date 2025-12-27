'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard, Building2, Users, FolderKanban, CheckSquare,
  Clock, Palmtree, Calendar, DollarSign, FileText, Briefcase,
  TrendingUp, GraduationCap, Bell, Settings, ChevronDown, ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { navigation, NavItem } from '@/lib/navigation';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Building2, Users, FolderKanban, CheckSquare,
  Clock, Palmtree, Calendar, DollarSign, FileText, Briefcase,
  TrendingUp, GraduationCap, Bell, Settings,
};

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

function SidebarContent({ 
  onItemClick, 
  collapsed,
  onCollapsedChange 
}: { 
  onItemClick?: () => void;
  collapsed: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['organization', 'recruitment']);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isActive = (href?: string) => href && pathname === href;
  const isParentActive = (href?: string) => href && pathname.startsWith(href);

  const renderNavItem = (item: NavItem, depth = 0) => {
    const Icon = item.icon ? iconMap[item.icon] : null;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);
    const parentActive = hasChildren && item.children?.some(c => isParentActive(c.href));

    if (collapsed && depth === 0) {
      return (
        <TooltipProvider key={item.id} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {item.href && !hasChildren ? (
                <Link href={item.href} onClick={onItemClick}>
                  <div className={cn(
                    'flex items-center justify-center h-9 w-9 mx-auto rounded-lg transition-colors',
                    active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  )}>
                    {Icon && <Icon className="h-[18px] w-[18px]" />}
                  </div>
                </Link>
              ) : (
                <div
                  className={cn(
                    'flex items-center justify-center h-9 w-9 mx-auto rounded-lg cursor-pointer transition-colors',
                    parentActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  )}
                  onClick={() => hasChildren && toggleExpanded(item.id)}
                >
                  {Icon && <Icon className="h-[18px] w-[18px]" />}
                </div>
              )}
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs font-medium">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <div key={item.id}>
        {item.href && !hasChildren ? (
          <Link href={item.href} onClick={onItemClick}>
            <div className={cn(
              'flex items-center gap-2.5 px-3 h-9 rounded-lg text-[13px] transition-colors',
              depth > 0 && 'ml-6',
              active 
                ? 'bg-blue-50 text-blue-600 font-medium' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}>
              {Icon && <Icon className={cn('h-4 w-4 flex-shrink-0', active ? 'text-blue-600' : 'text-slate-400')} />}
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-medium bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          </Link>
        ) : (
          <div
            className={cn(
              'flex items-center gap-2.5 px-3 h-9 rounded-lg text-[13px] cursor-pointer transition-colors',
              depth > 0 && 'ml-6',
              parentActive ? 'text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
            onClick={() => hasChildren && toggleExpanded(item.id)}
          >
            {Icon && <Icon className={cn('h-4 w-4 flex-shrink-0', parentActive ? 'text-blue-600' : 'text-slate-400')} />}
            <span className="truncate flex-1">{item.label}</span>
            {hasChildren && (
              <ChevronDown className={cn(
                'h-3.5 w-3.5 text-slate-400 transition-transform',
                !isExpanded && '-rotate-90'
              )} />
            )}
          </div>
        )}
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-0.5">
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className={cn(
        'flex items-center h-14 border-b border-slate-100 flex-shrink-0',
        collapsed ? 'justify-center px-2' : 'justify-between px-4'
      )}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-slate-900">HRMS</span>
          )}
        </div>
        {onCollapsedChange && !collapsed && (
          <button
            onClick={() => onCollapsedChange(true)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && onCollapsedChange && (
        <div className="flex justify-center py-2 border-b border-slate-100">
          <button
            onClick={() => onCollapsedChange(false)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className={cn('py-2', collapsed ? 'px-2' : 'px-2')}>
            {navigation.map((section, idx) => (
              <div key={idx} className={cn('mb-1', idx > 0 && !collapsed && 'mt-4')}>
                {section.label && !collapsed && (
                  <p className="px-3 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {section.label}
                  </p>
                )}
                {collapsed && idx > 0 && (
                  <div className="h-px bg-slate-100 mx-2 my-2" />
                )}
                <div className="space-y-0.5">
                  {section.items.map(item => renderNavItem(item))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export function Sidebar({ open, onOpenChange, collapsed, onCollapsedChange }: SidebarProps) {
  return (
    <>
      <aside className={cn(
        'hidden lg:flex fixed left-0 top-0 z-40 h-screen border-r border-slate-100 flex-col transition-all duration-200',
        collapsed ? 'w-[60px]' : 'w-52'
      )}>
        <SidebarContent collapsed={collapsed} onCollapsedChange={onCollapsedChange} />
      </aside>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-52">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent collapsed={false} onItemClick={() => onOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
