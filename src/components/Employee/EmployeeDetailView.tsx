
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap } from 'lucide-react';
import { Employee } from '@/types/employee';
import RoleBadge from '@/components/RoleBadge';
import StatusBadge from '@/components/StatusBadge';
import EmployeePerformanceChart from './EmployeePerformanceChart';
import { ProfileFormData } from '@/types/user';

interface EmployeeDetailViewProps {
  employee: ProfileFormData;
  onBack: () => void;
}

const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({ employee, onBack }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employee List
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Employee Details</h1>
          <p className="text-gray-600">Complete employee information and performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Profile */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={employee.profileImage} />
                <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                  {getInitials(employee.firstName)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{employee.firstName}</CardTitle>
              <div className="flex justify-center gap-2">
                <RoleBadge role={employee.role} />
                {/* <StatusBadge status={employee.status} /> */}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{employee.email}</span>
                </div>
                
                {employee.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{employee.phoneNumber}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <div>
                   <div className="font-medium">
  {employee.department
    ? employee.department.charAt(0).toUpperCase() + employee.department.slice(1)
    : ''}
</div>

                    <div className="text-gray-500">{employee.position}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Hire Date</div>
                    <div className="text-gray-500">{new Date(employee.startDate).toLocaleDateString()}</div>
                  </div>
                </div>

               {employee.salary && (
  <div className="flex items-center gap-2 text-sm">
    <div className="h-4 w-4 flex items-center justify-center">
      <span className="text-gray-500 text-xs">#</span>
    </div>
    <div>
      <div className="font-medium">Salary</div>
      <div className="text-gray-500">
        #{Number(employee.salary).toLocaleString()}
      </div>
    </div>
  </div>
)}

              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-green-700">Attendance</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4.8</div>
                  <div className="text-sm text-blue-700">Rating</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-purple-700">Projects</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">3y</div>
                  <div className="text-sm text-orange-700">Experience</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <EmployeePerformanceChart employeeId={employee._id} employeeName={employee.firstName} />
          
          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
            </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee ID</label>
                  <p className="text-sm">{employee._id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                              <div className="font-medium">
                {employee.department
                  ? employee.department.charAt(0).toUpperCase() + employee.department.slice(1)
                  : ''}
                  </div>

                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Position</label>
                  <p className="text-sm">{employee.position}</p>
                </div>
                {/* <div>
                  <label className="text-sm font-medium text-gray-500">Manager</label>
                  <p className="text-sm">{employee.managerId || 'Direct Report'}</p>
                </div> */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Employment Type</label>
                  <p className="text-sm">Full-time</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Review</label>
                  <p className="text-sm">December 2024</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Next Review</label>
                  <p className="text-sm">June 2025</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Goals Completed</label>
                  <p className="text-sm">8 of 10</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Training Hours</label>
                  <p className="text-sm">40 hours</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Certifications</label>
                  <p className="text-sm">3 active</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailView;
