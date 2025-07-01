
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Sun, Moon, Calendar, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: 'day' | 'night';
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'checked-in';
  hoursWorked?: number;
}

const AttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('clock-in');
  const [selectedShift, setSelectedShift] = useState<'day' | 'night'>('day');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentSession, setCurrentSession] = useState<{
    shift: 'day' | 'night';
    checkInTime: string;
  } | null>(null);

  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      employeeId: '4',
      employeeName: 'Jane Doe',
      date: '2024-01-15',
      shift: 'day',
      checkIn: '08:30',
      checkOut: '17:00',
      status: 'present',
      hoursWorked: 8.5
    },
    {
      id: '2',
      employeeId: '5',
      employeeName: 'Alice Smith',
      date: '2024-01-15',
      shift: 'night',
      checkIn: '20:00',
      checkOut: '04:00',
      status: 'present',
      hoursWorked: 8
    }
  ]);

  const handleClockIn = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    
    setIsCheckedIn(true);
    setCurrentSession({
      shift: selectedShift,
      checkInTime: timeString
    });

    toast({
      title: "Clocked In",
      description: `Successfully clocked in for ${selectedShift} shift at ${timeString}`,
    });
  };

  const handleClockOut = () => {
    if (!currentSession) return;

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);

    setIsCheckedIn(false);
    setCurrentSession(null);

    toast({
      title: "Clocked Out",
      description: `Successfully clocked out at ${timeString}`,
    });
  };

  const getShiftInfo = (shift: 'day' | 'night') => {
    return shift === 'day' 
      ? { time: '8:30 AM - 5:00 PM', icon: Sun, color: 'bg-yellow-100 text-yellow-800' }
      : { time: '8:00 PM - 4:00 AM', icon: Moon, color: 'bg-purple-100 text-purple-800' };
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canViewAllAttendance = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Attendance Management</h2>
          <p className="text-gray-600">Track time and attendance for day and night shifts</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clock-in">Clock In/Out</TabsTrigger>
          <TabsTrigger value="my-attendance">My Attendance</TabsTrigger>
          {canViewAllAttendance && <TabsTrigger value="team-attendance">Team Attendance</TabsTrigger>}
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="clock-in" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Day Shift Card */}
            <Card className={`cursor-pointer transition-all ${selectedShift === 'day' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''}`}
                  onClick={() => setSelectedShift('day')}>
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-700">
                  <Sun className="h-6 w-6 mr-2" />
                  Day Shift
                </CardTitle>
                <CardDescription>8:30 AM - 5:00 PM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">8.5 hours</div>
                  <p className="text-sm text-gray-600">Standard working hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Night Shift Card */}
            <Card className={`cursor-pointer transition-all ${selectedShift === 'night' ? 'ring-2 ring-purple-500 bg-purple-50' : ''}`}
                  onClick={() => setSelectedShift('night')}>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <Moon className="h-6 w-6 mr-2" />
                  Night Shift
                </CardTitle>
                <CardDescription>8:00 PM - 4:00 AM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">8 hours</div>
                  <p className="text-sm text-gray-600">Night working hours</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clock In/Out Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                Time Clock
              </CardTitle>
              <CardDescription>
                Selected shift: {getShiftInfo(selectedShift).time}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-4xl font-bold">
                {new Date().toLocaleTimeString()}
              </div>
              <div className="text-lg text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              {currentSession && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">
                    Checked in for {currentSession.shift} shift at {currentSession.checkInTime}
                  </p>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                {!isCheckedIn ? (
                  <Button onClick={handleClockIn} size="lg" className="px-8">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Clock In ({selectedShift} shift)
                  </Button>
                ) : (
                  <Button onClick={handleClockOut} size="lg" variant="destructive" className="px-8">
                    <Clock className="h-5 w-5 mr-2" />
                    Clock Out
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-attendance">
          <Card>
            <CardHeader>
              <CardTitle>My Attendance History</CardTitle>
              <CardDescription>View your attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords
                    .filter(record => !canViewAllAttendance || record.employeeId === user?.id)
                    .map((record) => {
                      const shiftInfo = getShiftInfo(record.shift);
                      const ShiftIcon = shiftInfo.icon;
                      return (
                        <TableRow key={record.id}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={shiftInfo.color}>
                              <ShiftIcon className="h-3 w-3 mr-1" />
                              {record.shift}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>{record.hoursWorked || '-'}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {canViewAllAttendance && (
          <TabsContent value="team-attendance">
            <Card>
              <CardHeader>
                <CardTitle>Team Attendance</CardTitle>
                <CardDescription>Monitor team attendance across all shifts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => {
                      const shiftInfo = getShiftInfo(record.shift);
                      const ShiftIcon = shiftInfo.icon;
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.employeeName}</TableCell>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={shiftInfo.color}>
                              <ShiftIcon className="h-3 w-3 mr-1" />
                              {record.shift}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>{record.hoursWorked || '-'}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Total Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-gray-500">Active employees</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Sun className="h-4 w-4 mr-2" />
                  Day Shift
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-gray-500">Present today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Moon className="h-4 w-4 mr-2" />
                  Night Shift
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">17</div>
                <p className="text-xs text-gray-500">Present today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Attendance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">94%</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceManagement;
