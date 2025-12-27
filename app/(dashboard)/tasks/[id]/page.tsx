'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Clock, CheckCircle2, Circle, Eye,
  Send, Paperclip, MoreHorizontal, MessageSquare, FileText, Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tasks, currentUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: string;
  isOwn?: boolean;
}

const mockComments: Comment[] = [
  { id: '1', userId: '1', userName: 'Sarah Miller', message: 'Hey, I started working on this task. Should be done by EOD.', timestamp: '10:30 AM', isOwn: false },
  { id: '2', userId: '2', userName: 'You', message: 'Great! Let me know if you need any help with the design specs.', timestamp: '10:45 AM', isOwn: true },
  { id: '3', userId: '1', userName: 'Sarah Miller', message: 'Actually, could you share the Figma link for the new components?', timestamp: '11:00 AM', isOwn: false },
  { id: '4', userId: '2', userName: 'You', message: 'Sure, here it is: figma.com/file/xyz123', timestamp: '11:05 AM', isOwn: true },
  { id: '5', userId: '1', userName: 'Sarah Miller', message: 'Perfect, thanks! I\'ll update you once I have the first draft ready.', timestamp: '11:10 AM', isOwn: false },
];

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const task = tasks.find(t => t.id === id) || tasks[0];
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newMessage, setNewMessage] = useState('');
  const [description, setDescription] = useState(task.description || 'Add a description for this task...');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    setComments([...comments, newComment]);
    setNewMessage('');
  };

  const statusConfig = {
    todo: { label: 'To Do', icon: Circle, color: 'text-slate-400', bg: 'bg-slate-100' },
    in_progress: { label: 'In Progress', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    review: { label: 'In Review', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50' },
    done: { label: 'Done', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
  };

  const priorityConfig = {
    low: { label: 'Low', color: 'bg-slate-100 text-slate-600' },
    medium: { label: 'Medium', color: 'bg-amber-50 text-amber-600' },
    high: { label: 'High', color: 'bg-red-50 text-red-600' },
  };

  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;

  return (
    <div className="h-[calc(100vh-theme(spacing.14)-theme(spacing.8))]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/tasks">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-slate-900">{task.title}</h1>
          <p className="text-xs text-slate-500">Task #{task.id} • Created Dec 20, 2024</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-60px)]">
        {/* Main Content - Chat */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-100 flex flex-col h-full">
          <Tabs defaultValue="comments" className="flex flex-col h-full">
            <div className="px-4 py-2 border-b border-slate-100">
              <TabsList className="h-8">
                <TabsTrigger value="comments" className="text-xs h-6 gap-1">
                  <MessageSquare className="h-3 w-3" /> Comments
                </TabsTrigger>
                <TabsTrigger value="description" className="text-xs h-6 gap-1">
                  <FileText className="h-3 w-3" /> Description
                </TabsTrigger>
                <TabsTrigger value="attachments" className="text-xs h-6 gap-1">
                  <Link2 className="h-3 w-3" /> Attachments
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="comments" className="flex-1 flex flex-col m-0 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={cn('flex gap-3', comment.isOwn && 'flex-row-reverse')}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">
                        {comment.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn('max-w-[70%]', comment.isOwn && 'text-right')}>
                      <div className="flex items-center gap-2 mb-1">
                        {!comment.isOwn && <span className="text-xs font-medium text-slate-700">{comment.userName}</span>}
                        <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                      </div>
                      <div className={cn(
                        'px-3 py-2 rounded-lg text-sm',
                        comment.isOwn 
                          ? 'bg-blue-500 text-white rounded-br-none' 
                          : 'bg-slate-100 text-slate-700 rounded-bl-none'
                      )}>
                        {comment.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 h-9 text-sm"
                  />
                  <Button size="icon" className="h-8 w-8" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="description" className="flex-1 p-4 m-0">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] text-sm resize-none border-0 focus-visible:ring-0 p-0"
                placeholder="Add a description..."
              />
            </TabsContent>

            <TabsContent value="attachments" className="flex-1 p-4 m-0">
              <div className="text-center py-8 text-sm text-slate-500">
                <Paperclip className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                No attachments yet
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Task Details */}
        <div className="bg-white rounded-lg border border-slate-100 p-4 h-fit">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Task Details</h3>
          
          <div className="space-y-4">
            {/* Status */}
            <div>
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Status</label>
              <div className={cn('flex items-center gap-2 mt-1 px-3 py-2 rounded-lg', status.bg)}>
                <StatusIcon className={cn('h-4 w-4', status.color)} />
                <span className="text-sm font-medium text-slate-700">{status.label}</span>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Priority</label>
              <div className="mt-1">
                <Badge className={cn('text-xs', priority.color)}>{priority.label}</Badge>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Assignee</label>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">
                    {task.assigneeName?.split(' ').map((n: string) => n[0]).join('') || 'UN'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-slate-700">{task.assigneeName || 'Unassigned'}</span>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Due Date</label>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-700">
                <Calendar className="h-4 w-4 text-slate-400" />
                {task.dueDate}
              </div>
            </div>

            {/* Project */}
            <div>
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Project</label>
              <div className="mt-1 text-sm text-slate-700">{task.projectId ? `Project #${task.projectId}` : 'No project'}</div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Tags</label>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="outline" className="text-[10px]">Design</Badge>
                <Badge variant="outline" className="text-[10px]">Frontend</Badge>
                <Badge variant="outline" className="text-[10px]">Q4</Badge>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-medium text-slate-500 mb-3">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                <div>
                  <p className="text-xs text-slate-600">Status changed to In Progress</p>
                  <p className="text-[10px] text-slate-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                <div>
                  <p className="text-xs text-slate-600">Sarah Miller assigned</p>
                  <p className="text-[10px] text-slate-400">Yesterday</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5" />
                <div>
                  <p className="text-xs text-slate-600">Task created</p>
                  <p className="text-[10px] text-slate-400">Dec 20, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
