
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { AttendanceRecord, AttendanceStats } from '@/types/attendance';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '4',
    employeeName: 'Jane Doe',
    date: '2024-01-27',
    clockIn: '09:00:00',
    clockOut: '17:30:00',
    totalHours: 8.5,
    status: 'present',
    biometricId: 'BIO001'
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Jane Doe',
    date: '2024-01-26',
    clockIn: '09:15:00',
    clockOut: '17:30:00',
    totalHours: 8.25,
    status: 'late',
    biometricId: 'BIO001'
  }
];

const AttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentStatus, setCurrentStatus] = useState<'out' | 'in'>('out');

  const stats: AttendanceStats = {
    totalPresent: 22,
    totalAbsent: 2,
    totalLate: 3,
    averageHours: 8.2,
    attendanceRate: 91.7
  };

  const handleClockIn = () => {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    const dateString = now.toISOString().split('T')[0];
    
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      employeeId: user?.id || '',
      employeeName: user ? `${user.firstName} ${user.lastName}` : '',
      date: dateString,
      clockIn: timeString,
      totalHours: 0,
      status: timeString > '09:00:00' ? 'late' : 'present',
      biometricId: `BIO${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    setCurrentStatus('in');
    
    toast({
      title: "Clocked In",
      description: `Successfully clocked in at ${timeString}`,
    });
  };

  const handleClockOut = () => {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    const dateString = now.toISOString().split('T')[0];
    
    setAttendanceRecords(prev => prev.map(record => {
      if (record.date === dateString && record.employeeId === user?.id && !record.clockOut) {
        const clockInTime = new Date(`${dateString}T${record.clockIn}`);
        const clockOutTime = new Date(`${dateString}T${timeString}`);
        const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
        
        return {
          ...record,
          clockOut: timeString,
          totalHours: Math.round(totalHours * 100) / 100
        };
      }
      return record;
    }));
    
    setCurrentStatus('out');
    
    toast({
      title: "Clocked Out",
      description: `Successfully clocked out at ${timeString}`,
    });
  };

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const variants = {
      present: 'default',
      late: 'destructive',
      absent: 'secondary',
      partial: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const canViewAllAttendance = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Attendance Management</h2>
        <p className="text-gray-600">Track and manage employee attendance</p>
      </div>

      <Tabs defaultValue="clock" className="space-y-6">
        <TabsList>
          <TabsTrigger value="clock">Clock In/Out</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
          {canViewAllAttendance && <TabsTrigger value="overview">Overview</TabsTrigger>}
        </TabsList>

        <TabsContent value="clock" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Time Clock
                </CardTitle>
                <CardDescription>
                  Current time: {new Date().toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {new Date().toLocaleTimeString()}
                  </div>
                  <div className="text-gray-500">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleClockIn} 
                    disabled={currentStatus === 'in'}
                    className="flex-1"
                    variant={currentStatus === 'out' ? 'default' : 'outline'}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Clock In
                  </Button>
                  <Button 
                    onClick={handleClockOut} 
                    disabled={currentStatus === 'out'}
                    className="flex-1"
                    variant={currentStatus === 'in' ? 'default' : 'outline'}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Clock Out
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500">
                  Status: <span className="font-medium">{currentStatus === 'in' ? 'Clocked In' : 'Clocked Out'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Clock In:</span>
                    <span className="font-medium">09:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clock Out:</span>
                    <span className="font-medium">--:-- --</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Hours:</span>
                    <span className="font-medium">0.0 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="default">Present</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>View your attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Biometric ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords
                    .filter(record => canViewAllAttendance || record.employeeId === user?.id)
                    .map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{record.clockIn || '--'}</TableCell>
                      <TableCell>{record.clockOut || '--'}</TableCell>
                      <TableCell>
                        {record.totalHours ? `${record.totalHours} hrs` : '--'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {record.biometricId}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {canViewAllAttendance && (
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{stats.totalPresent}</div>
                  <p className="text-sm text-gray-600">Present Days</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{stats.totalAbsent}</div>
                  <p className="text-sm text-gray-600">Absent Days</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-600">{stats.totalLate}</div>
                  <p className="text-sm text-gray-600">Late Days</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Employee Attendance</CardTitle>
                <CardDescription>Overview of all employee attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.employeeName}
                        </TableCell>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{record.clockIn || '--'}</TableCell>
                        <TableCell>{record.clockOut || '--'}</TableCell>
                        <TableCell>
                          {record.totalHours ? `${record.totalHours} hrs` : '--'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(record.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AttendanceManagement;
