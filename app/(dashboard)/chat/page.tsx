'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, Search, MoreHorizontal, Phone, Video, 
  Users, Hash, Plus, Smile, File, Pin, Star, Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileName?: string;
  isOwn?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'channel' | 'direct';
  unread?: number;
  lastMessage?: string;
  isOnline?: boolean;
  isPinned?: boolean;
}

const channels: Channel[] = [
  { id: '1', name: 'general', type: 'channel', unread: 3, lastMessage: 'Hey team, meeting at 3pm', isPinned: true },
  { id: '2', name: 'engineering', type: 'channel', unread: 0, lastMessage: 'PR merged successfully', isPinned: true },
  { id: '3', name: 'design', type: 'channel', unread: 1, lastMessage: 'New mockups ready' },
  { id: '4', name: 'hr-announcements', type: 'channel', unread: 0, lastMessage: 'Holiday schedule' },
  { id: '5', name: 'random', type: 'channel', unread: 5, lastMessage: 'Anyone up for lunch?' },
];

const directMessages: Channel[] = [
  { id: 'd1', name: 'Sarah Miller', type: 'direct', unread: 2, lastMessage: 'Can you review my PR?', isOnline: true },
  { id: 'd2', name: 'John Davis', type: 'direct', unread: 0, lastMessage: 'Thanks for the help!', isOnline: true },
  { id: 'd3', name: 'Emma Wilson', type: 'direct', unread: 0, lastMessage: 'See you tomorrow', isOnline: false },
  { id: 'd4', name: 'Mike Brown', type: 'direct', unread: 1, lastMessage: 'Deployment done', isOnline: true },
];

const mockMessages: Message[] = [
  { id: '1', senderId: '2', senderName: 'John Davis', content: 'Good morning everyone! 👋', timestamp: '9:00 AM', type: 'text' },
  { id: '2', senderId: '1', senderName: 'Sarah Miller', content: 'Morning! Ready for the standup?', timestamp: '9:02 AM', type: 'text' },
  { id: '3', senderId: '3', senderName: 'Emma Wilson', content: 'Yes! I have some updates on the design system', timestamp: '9:03 AM', type: 'text' },
  { id: '4', senderId: '4', senderName: 'Mike Brown', content: 'Just pushed the latest changes to staging', timestamp: '9:05 AM', type: 'text' },
  { id: '5', senderId: 'current', senderName: 'You', content: 'Great work everyone! Let me check the staging environment', timestamp: '9:07 AM', type: 'text', isOwn: true },
  { id: '6', senderId: '1', senderName: 'Sarah Miller', content: 'Here are the updated wireframes for the dashboard', timestamp: '9:10 AM', type: 'file', fileName: 'dashboard-wireframes.pdf' },
  { id: '7', senderId: '2', senderName: 'John Davis', content: 'Looks good! I have a few suggestions for the navigation', timestamp: '9:15 AM', type: 'text' },
  { id: '8', senderId: 'current', senderName: 'You', content: 'I agree, the new layout is much cleaner. Great job on the spacing!', timestamp: '9:18 AM', type: 'text', isOwn: true },
];

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      isOwn: true,
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const pinnedChannels = channels.filter(c => c.isPinned);
  const otherChannels = channels.filter(c => !c.isPinned);

  return (
    <div className="h-[calc(100vh-theme(spacing.14)-theme(spacing.8))] flex rounded-xl overflow-hidden border border-slate-200 bg-white">
      {/* Sidebar */}
      <div className="w-72 border-r border-slate-100 flex flex-col">
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Messages</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm bg-slate-50 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-slate-200"
            />
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto px-2">
          {/* Pinned */}
          {pinnedChannels.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-1.5 px-2 py-2">
                <Pin className="h-3 w-3 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Pinned</span>
              </div>
              {pinnedChannels.map((channel) => (
                <ChannelItem 
                  key={channel.id} 
                  channel={channel} 
                  isSelected={selectedChannel.id === channel.id}
                  onClick={() => setSelectedChannel(channel)}
                />
              ))}
            </div>
          )}

          {/* Channels */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Channels</span>
              <span className="text-[10px] text-slate-400">{otherChannels.length}</span>
            </div>
            {otherChannels.map((channel) => (
              <ChannelItem 
                key={channel.id} 
                channel={channel} 
                isSelected={selectedChannel.id === channel.id}
                onClick={() => setSelectedChannel(channel)}
              />
            ))}
          </div>

          {/* Direct Messages */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Direct Messages</span>
              <span className="text-[10px] text-slate-400">{directMessages.length}</span>
            </div>
            {directMessages.map((dm) => (
              <DMItem 
                key={dm.id} 
                channel={dm} 
                isSelected={selectedChannel.id === dm.id}
                onClick={() => setSelectedChannel(dm)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {/* Chat Header */}
        <div className="h-14 px-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedChannel.type === 'channel' ? (
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Hash className="h-4 w-4 text-white" />
              </div>
            ) : (
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                    {selectedChannel.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {selectedChannel.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {selectedChannel.type === 'channel' ? `#${selectedChannel.name}` : selectedChannel.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                {selectedChannel.type === 'channel' ? '24 members • 5 online' : selectedChannel.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <Users className="h-4 w-4" />
            </Button>
            <div className="w-px h-5 bg-slate-200 mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-1">
            {messages.map((message, index) => {
              const showHeader = index === 0 || messages[index - 1].senderId !== message.senderId;
              const isLastInGroup = index === messages.length - 1 || messages[index + 1].senderId !== message.senderId;
              
              return (
                <div key={message.id} className={cn('group', showHeader && index !== 0 && 'mt-4')}>
                  {showHeader && (
                    <div className={cn('flex items-center gap-3 mb-1', message.isOwn && 'flex-row-reverse')}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={cn(
                          'text-[11px] font-medium',
                          message.isOwn 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                            : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
                        )}>
                          {message.senderName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn('flex items-baseline gap-2', message.isOwn && 'flex-row-reverse')}>
                        <span className="text-sm font-medium text-slate-900">{message.senderName}</span>
                        <span className="text-[11px] text-slate-400">{message.timestamp}</span>
                      </div>
                    </div>
                  )}
                  <div className={cn('flex', message.isOwn ? 'justify-end' : 'pl-11')}>
                    {message.type === 'file' ? (
                      <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
                        <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                          <File className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{message.fileName}</p>
                          <p className="text-[11px] text-slate-400">PDF • 2.4 MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className={cn(
                        'inline-block px-4 py-2.5 text-sm max-w-[80%]',
                        message.isOwn 
                          ? 'bg-blue-500 text-white rounded-2xl rounded-br-md' 
                          : 'bg-white text-slate-700 rounded-2xl rounded-bl-md border border-slate-100',
                        !showHeader && message.isOwn && 'rounded-tr-md',
                        !showHeader && !message.isOwn && 'rounded-tl-md'
                      )}>
                        {message.content}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-slate-50 rounded-2xl p-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex-shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-h-[36px] flex items-center">
                <Input
                  placeholder={`Message ${selectedChannel.type === 'channel' ? '#' : ''}${selectedChannel.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="border-0 bg-transparent focus-visible:ring-0 text-sm h-9 px-0"
                />
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  className="h-9 w-9 rounded-xl bg-blue-500 hover:bg-blue-600" 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelItem({ channel, isSelected, onClick }: { channel: Channel; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all',
        isSelected 
          ? 'bg-blue-50 text-blue-600' 
          : 'hover:bg-slate-50 text-slate-600'
      )}
    >
      <div className={cn(
        'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0',
        isSelected ? 'bg-blue-100' : 'bg-slate-100'
      )}>
        <Hash className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', isSelected && 'text-blue-600')}>{channel.name}</p>
        <p className="text-[11px] text-slate-400 truncate">{channel.lastMessage}</p>
      </div>
      {channel.unread ? (
        <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-blue-500 text-white text-[11px] font-medium flex items-center justify-center">
          {channel.unread}
        </span>
      ) : null}
    </button>
  );
}

function DMItem({ channel, isSelected, onClick }: { channel: Channel; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all',
        isSelected 
          ? 'bg-blue-50 text-blue-600' 
          : 'hover:bg-slate-50 text-slate-600'
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-[11px] bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600">
            {channel.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        {channel.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', isSelected && 'text-blue-600')}>{channel.name}</p>
        <p className="text-[11px] text-slate-400 truncate">{channel.lastMessage}</p>
      </div>
      {channel.unread ? (
        <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-blue-500 text-white text-[11px] font-medium flex items-center justify-center">
          {channel.unread}
        </span>
      ) : null}
    </button>
  );
}
