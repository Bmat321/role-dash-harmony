
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DepartmentManagement from './DepartmentManagement';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';

import { Card, CardContent } from '@/components/ui/card';
import { useCombinedContext } from '@/contexts/AuthContext';

export const SystemSettings: React.FC = () => {
       const {user: userSystemSettings,  profile } = useCombinedContext();
      const { user} = userSystemSettings

  if (user?.role !== 'hr') {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
