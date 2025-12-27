'use client';

import { useState } from 'react';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared';
import { notifications } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [list, setList] = useState(notifications);

  const markAsRead = (id: string) => {
    setList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Marked as read');
  };

  const markAllAsRead = () => {
    setList(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All marked as read');
  };

  const deleteNotification = (id: string) => {
    setList(prev => prev.filter(n => n.id !== id));
    toast.success('Deleted');
  };

  const unreadCount = list.filter(n => !n.read).length;

  const renderNotification = (n: typeof notifications[0]) => (
    <div key={n.id} className={cn('flex items-start gap-3 p-3 border-b border-slate-50 last:border-0', !n.read && 'bg-blue-50/30')}>
      <div className={cn('w-2 h-2 mt-1.5 rounded-full flex-shrink-0',
        n.type === 'success' ? 'bg-green-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      )} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{n.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
        <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-1">
        {!n.read && (
          <button onClick={() => markAsRead(n.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100">
            <Check className="h-3.5 w-3.5 text-slate-400" />
          </button>
        )}
        <button onClick={() => deleteNotification(n.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100">
          <Trash2 className="h-3.5 w-3.5 text-slate-400 hover:text-red-500" />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated with your notifications"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Notifications' }]}
        actions={unreadCount > 0 && (
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
            <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
          </Button>
        )}
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="h-8">
          <TabsTrigger value="all" className="text-xs h-6">All ({list.length})</TabsTrigger>
          <TabsTrigger value="unread" className="text-xs h-6">Unread ({unreadCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="bg-white rounded-lg border border-slate-100">
            {list.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No notifications</p>
              </div>
            ) : list.map(renderNotification)}
          </div>
        </TabsContent>

        <TabsContent value="unread">
          <div className="bg-white rounded-lg border border-slate-100">
            {list.filter(n => !n.read).length === 0 ? (
              <div className="py-12 text-center">
                <CheckCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">All caught up!</p>
              </div>
            ) : list.filter(n => !n.read).map(renderNotification)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
