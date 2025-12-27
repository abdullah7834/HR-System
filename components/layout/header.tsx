'use client';

import { Bell, Search, Menu, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { currentUser, notifications } from '@/lib/mock-data';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-100">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search..."
              className="w-64 h-8 pl-8 text-sm bg-slate-50 border-0 focus-visible:ring-1 focus-visible:ring-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end">
              <div className="p-3 border-b border-slate-100">
                <p className="text-sm font-medium">Notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="px-3 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" className="w-full h-7 text-xs text-blue-600">
                  View all
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 h-8 px-2 rounded-md hover:bg-slate-100">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="text-[10px] bg-blue-100 text-blue-600">
                    {currentUser.firstName[0]}{currentUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm text-slate-700">{currentUser.firstName}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="text-sm">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
