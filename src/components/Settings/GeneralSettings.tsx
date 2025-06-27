
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Building, Clock, MapPin, Users, Globe, Mail } from 'lucide-react';

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    companyName: 'Tech Solutions Inc.',
    companyEmail: 'info@techsolutions.com',
    companyPhone: '+1 (555) 123-4567',
    companyAddress: '123 Business Ave, Suite 100, City, State 12345',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: { start: '09:00', end: '17:00' },
    allowRemoteWork: true,
    enableNotifications: true,
    autoApproveLeave: false,
    leaveCarryover: true,
    maxLeaveCarryover: 5,
    probationPeriod: 90,
    language: 'en',
    currency: 'USD'
  });

  const handleSave = () => {
    console.log('Saving general settings:', settings);
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-gray-500">Configure basic company information and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>Basic company details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyPhone">Phone Number</Label>
                <Input
                  id="companyPhone"
                  value={settings.companyPhone}
                  onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="companyAddress">Company Address</Label>
              <Input
                id="companyAddress"
                value={settings.companyAddress}
                onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Work Schedule
            </CardTitle>
            <CardDescription>Default working hours and schedule configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) => handleInputChange('workingHours', { ...settings.workingHours, start: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) => handleInputChange('workingHours', { ...settings.workingHours, end: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Policies</CardTitle>
            <CardDescription>Configure leave management settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="probationPeriod">Probation Period (days)</Label>
                <Input
                  id="probationPeriod"
                  type="number"
                  value={settings.probationPeriod}
                  onChange={(e) => handleInputChange('probationPeriod', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="maxLeaveCarryover">Max Leave Carryover (days)</Label>
                <Input
                  id="maxLeaveCarryover"
                  type="number"
                  value={settings.maxLeaveCarryover}
                  onChange={(e) => handleInputChange('maxLeaveCarryover', parseInt(e.target.value))}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-approve Leave Requests</Label>
                  <p className="text-sm text-gray-500">Automatically approve certain types of leave requests</p>
                </div>
                <Switch
                  checked={settings.autoApproveLeave}
                  onCheckedChange={(checked) => handleInputChange('autoApproveLeave', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Leave Carryover</Label>
                  <p className="text-sm text-gray-500">Allow employees to carry over unused leave to next year</p>
                </div>
                <Switch
                  checked={settings.leaveCarryover}
                  onCheckedChange={(checked) => handleInputChange('leaveCarryover', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Remote Work</Label>
                  <p className="text-sm text-gray-500">Allow employees to work remotely</p>
                </div>
                <Switch
                  checked={settings.allowRemoteWork}
                  onCheckedChange={(checked) => handleInputChange('allowRemoteWork', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
