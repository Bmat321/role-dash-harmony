
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Building, Users } from 'lucide-react';

interface DepartmentRoleStatsProps {
  stats: {
    departments: Record<string, number>;
    roleDistribution: Record<string, number>;
    totalEmployees: number;
  };
}

const DepartmentRoleStats: React.FC<DepartmentRoleStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Department Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base lg:text-lg flex items-center gap-2">
            <Building className="h-5 w-5" />
            Department Distribution
          </CardTitle>
          <CardDescription className="text-sm">Employee count by department</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(stats.departments).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(stats.departments)
                .sort(([,a], [,b]) => b - a)
                .map(([dept, count]) => (
                <div key={dept} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dept}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs lg:text-sm text-gray-500">{count} employees</span>
                      <span className="text-xs text-gray-400">
                        ({Math.round((count / stats.totalEmployees) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={(count / stats.totalEmployees) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No department data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base lg:text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Role Distribution
          </CardTitle>
          <CardDescription className="text-sm">Employee count by role</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(stats.roleDistribution).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(stats.roleDistribution)
                .sort(([,a], [,b]) => b - a)
                .map(([role, count]) => (
                <div key={role} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{role}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs lg:text-sm text-gray-500">{count} employees</span>
                      <span className="text-xs text-gray-400">
                        ({Math.round((count / stats.totalEmployees) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={(count / stats.totalEmployees) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No role data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentRoleStats;
