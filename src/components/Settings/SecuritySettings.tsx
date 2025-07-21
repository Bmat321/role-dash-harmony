
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Shield, Key, Clock, Users, AlertTriangle, Eye, Lock } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = useState({
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    enableTwoFactor: false,
    enableSSOLogin: false,
    sessionTimeout: 480,
    allowMultipleSessions: true,
    enableAuditLog: true,
    enableLoginNotifications: true,
    enableIpWhitelist: false,
    ipWhitelist: '',
    dataRetentionPeriod: 365,
    enableDataEncryption: true
  });

  const [auditLogs] = useState([
    { id: 1, user: 'John Doe', action: 'Login', timestamp: '2024-01-15 09:30:00', ip: '192.168.1.100', status: 'Success' },
    { id: 2, user: 'Jane Smith', action: 'Password Change', timestamp: '2024-01-15 10:15:00', ip: '192.168.1.101', status: 'Success' },
    { id: 3, user: 'Admin', action: 'User Created', timestamp: '2024-01-15 11:00:00', ip: '192.168.1.1', status: 'Success' },
    { id: 4, user: 'Bob Wilson', action: 'Failed Login', timestamp: '2024-01-15 11:30:00', ip: '192.168.1.102', status: 'Failed' },
  ]);

  const handleSave = () => {
    console.log('Saving security settings:', settings);
    toast({
      title: "Security Settings Saved",
      description: "Security configurations have been updated successfully.",
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-gray-500">Configure security policies and authentication settings</p>
      </div>

      <div className="grid gap-6">
        {/* Password Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Password Policy
            </CardTitle>
            <CardDescription>Set password requirements and security standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  min="6"
                  max="20"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => handleInputChange('passwordExpiry', parseInt(e.target.value))}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Uppercase Letters</Label>
                  <p className="text-sm text-gray-500">Password must contain at least one uppercase letter</p>
                </div>
                <Switch
                  checked={settings.requireUppercase}
                  onCheckedChange={(checked) => handleInputChange('requireUppercase', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Numbers</Label>
                  <p className="text-sm text-gray-500">Password must contain at least one number</p>
                </div>
                <Switch
                  checked={settings.requireNumbers}
                  onCheckedChange={(checked) => handleInputChange('requireNumbers', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Special Characters</Label>
                  <p className="text-sm text-gray-500">Password must contain special characters (!@#$%^&*)</p>
                </div>
                <Switch
                  checked={settings.requireSpecialChars}
                  onCheckedChange={(checked) => handleInputChange('requireSpecialChars', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication & Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication & Access Control
            </CardTitle>
            <CardDescription>Configure login security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                <Input
                  id="lockoutDuration"
                  type="number"
                  value={settings.lockoutDuration}
                  onChange={(e) => handleInputChange('lockoutDuration', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Require 2FA for all user accounts</p>
                </div>
                <Switch
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) => handleInputChange('enableTwoFactor', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable SSO Login</Label>
                  <p className="text-sm text-gray-500">Allow Single Sign-On authentication</p>
                </div>
                <Switch
                  checked={settings.enableSSOLogin}
                  onCheckedChange={(checked) => handleInputChange('enableSSOLogin', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Multiple Sessions</Label>
                  <p className="text-sm text-gray-500">Allow users to login from multiple devices</p>
                </div>
                <Switch
                  checked={settings.allowMultipleSessions}
                  onCheckedChange={(checked) => handleInputChange('allowMultipleSessions', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Data Protection
            </CardTitle>
            <CardDescription>Configure data security and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  value={settings.dataRetentionPeriod}
                  onChange={(e) => handleInputChange('dataRetentionPeriod', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="ipWhitelist">IP Whitelist (comma-separated)</Label>
                <Input
                  id="ipWhitelist"
                  value={settings.ipWhitelist}
                  placeholder="192.168.1.1, 10.0.0.1"
                  onChange={(e) => handleInputChange('ipWhitelist', e.target.value)}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Data Encryption</Label>
                  <p className="text-sm text-gray-500">Encrypt sensitive data at rest</p>
                </div>
                <Switch
                  checked={settings.enableDataEncryption}
                  onCheckedChange={(checked) => handleInputChange('enableDataEncryption', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable IP Whitelist</Label>
                  <p className="text-sm text-gray-500">Restrict access to whitelisted IP addresses</p>
                </div>
                <Switch
                  checked={settings.enableIpWhitelist}
                  onCheckedChange={(checked) => handleInputChange('enableIpWhitelist', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Login Notifications</Label>
                  <p className="text-sm text-gray-500">Send email notifications for login attempts</p>
                </div>
                <Switch
                  checked={settings.enableLoginNotifications}
                  onCheckedChange={(checked) => handleInputChange('enableLoginNotifications', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Audit Logs
            </CardTitle>
            <CardDescription>View recent security events and user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Audit Logging</Label>
                  <p className="text-sm text-gray-500">Log user activities and security events</p>
                </div>
                <Switch
                  checked={settings.enableAuditLog}
                  onCheckedChange={(checked) => handleInputChange('enableAuditLog', checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Recent Activities</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.user}</span>
                          <span className="text-gray-500">•</span>
                          <span>{log.action}</span>
                          <Badge variant={log.status === 'Success' ? 'default' : 'destructive'} className="ml-2">
                            {log.status}
                          </Badge>
                        </div>
                        <div className="text-gray-500 mt-1">
                          {log.timestamp} • IP: {log.ip}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Security Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
