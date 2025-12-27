'use client';

import { useState } from 'react';
import { Save, Building2, Bell, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Settings saved');
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account settings"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]}
      />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="h-8">
          <TabsTrigger value="general" className="text-xs h-6">General</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs h-6">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="text-xs h-6">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="bg-white rounded-lg border border-slate-100">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-medium text-slate-900">Company Information</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Company Name</Label>
                  <Input defaultValue="Acme Corporation" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Website</Label>
                  <Input defaultValue="https://acme.com" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Timezone</Label>
                  <Select defaultValue="pst">
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-white rounded-lg border border-slate-100">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-medium text-slate-900">Notification Preferences</h3>
            </div>
            <div className="p-4 space-y-4">
              {['Email Notifications', 'Leave Request Updates', 'Task Assignments', 'Payslip Available'].map((item) => (
                <div key={item} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-700">{item}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="bg-white rounded-lg border border-slate-100">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-medium text-slate-900">Security Settings</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-900">Change Password</h4>
                <div className="space-y-1">
                  <Label className="text-xs">Current Password</Label>
                  <Input type="password" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">New Password</Label>
                  <Input type="password" className="h-8 text-sm" />
                </div>
                <Button size="sm" className="h-8 text-xs">Update Password</Button>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Add extra security to your account</p>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs">Enable</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-4">
        <Button size="sm" className="h-8 text-xs" onClick={handleSave} disabled={saving}>
          <Save className="h-3.5 w-3.5 mr-1" /> {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
