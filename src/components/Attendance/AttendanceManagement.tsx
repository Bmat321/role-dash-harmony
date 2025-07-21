
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Sun, Moon, Calendar, Users, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCombinedContext } from '@/contexts/AuthContext';
import { AttendanceRecord } from '@/types/attendance';
import { useReduxAttendance } from '@/hooks/attendance/useReduxAttendance';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSelectedShift, setActiveTab, setCurrentSession, setIsCheckedIn, setIsClocking, setSelectedShift } from '@/store/slices/attendance/attendanceSlice';
import { getShiftClockStatus, getShiftInfo, getStatusColor, shiftUtils } from '@/utils/attendanceHelpers';
import { useShiftClockStatus } from '@/hooks/useShiftClockStatus';



const AttendanceManagement: React.FC = () => {
  // const { user } = useAuth();
  const dispatch = useAppDispatch();  
  const {user: userAttendanceManagement,  profile, attendance } = useCombinedContext();
  const { user} = userAttendanceManagement
  const { toast } = useToast();
  const { activeTab, error, currentSession, isCheckedIn, records, companySummary, selectedShift, isLoading , isClocking } = useAppSelector((state) => state.attendance);

 const {handleManualCheckIn, handleManualCheckOut} = useReduxAttendance()
  

const { canClockIn } = useShiftClockStatus(records, selectedShift)

  // const handleClockIn = async () => {
  //   const now = new Date();
  //   const timeString = now.toTimeString().slice(0, 5);
  
  //   dispatch(setCurrentSession({
  //     shift: selectedShift,
  //     checkInTime: timeString
  //   }));
    
  //   await handleManualCheckIn({
  //     shift: selectedShift,
  //     checkInTime: timeString,
  //   })

  // };



  const handleClockIn = async () => {
  const now = new Date();
  const timeString = now.toTimeString().slice(0, 5);

  dispatch(setIsClocking(true));

  dispatch(setCurrentSession({
    shift: selectedShift,
    checkInTime: timeString
  }));

  const success = await handleManualCheckIn({
    shift: selectedShift,
    checkInTime: timeString,
  });

  dispatch(setIsClocking(false));
};


  const handleClockOut = async () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    dispatch(setIsClocking(true));
      const success = await handleManualCheckOut({
    shift: selectedShift,
    checkInTime: timeString,
  });

  dispatch(setIsClocking(false));
  dispatch(clearSelectedShift());
  shiftUtils.clear();
  dispatch(setSelectedShift('day'));
  dispatch(setActiveTab('clock-in'));


  };

  
useEffect(() => {
  const storedShift = shiftUtils.get();
  dispatch(setSelectedShift(storedShift));
}, [dispatch]);


  // const canViewAllAttendance = user?.role.toLowerCase() === 'admin' || user?.role.toLowerCase() === 'hr' || user?.role.toLowerCase() === 'manager';


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Attendance Management</h2>
          <p className="text-gray-600">Track time and attendance for day and night shifts</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => dispatch(setActiveTab(val))}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clock-in">Clock In/Out</TabsTrigger>
          <TabsTrigger value="my-attendance">My Attendance</TabsTrigger>
          {/* {canViewAllAttendance && <TabsTrigger value="team-attendance">Team Attendance</TabsTrigger>} */}
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="clock-in" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Day Shift Card */}
            <Card className={`cursor-pointer transition-all ${selectedShift === 'day' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''}`}
                  onClick={() => {
  if (!isCheckedIn) {
    dispatch(setSelectedShift('day'));
    shiftUtils.set('day');
  }
}}
                  >
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
                  onClick={() => {
  if (!isCheckedIn) {
    dispatch(setSelectedShift('night'));
    shiftUtils.set('night');
  }
}}

                  >
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <Moon className="h-6 w-6 mr-2" />
                  Night Shift
                </CardTitle>
                <CardDescription>4:00 PM - 5:00 AM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">13 hours</div>
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
              
              {currentSession && isCheckedIn && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">
                    Checked in for {currentSession.shift} shift at {currentSession.checkInTime}
                  </p>
                </div>
              )}

          <div className="flex justify-center space-x-4">
        {!isCheckedIn ? (
          <Button onClick={handleClockIn} size="lg" className="px-8" disabled={isLoading ||  !canClockIn}>
            <CheckCircle className="h-5 w-5 mr-2" />
            Clock In ({selectedShift.charAt(0).toUpperCase() + selectedShift.slice(1)} shift)
            {isClocking && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
          </Button>
        ) : (
          <Button onClick={handleClockOut} size="lg" variant="destructive" className="px-8" disabled={isLoading}>
            <Clock className="h-5 w-5 mr-2" />
            Clock Out
            {isClocking && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
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
  {records?.length ? (
    [...records]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 🔁 Sort by latest first
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
            <TableCell>
              {record.checkIn
                ? new Date(record.checkIn).toLocaleTimeString([], { hour12: true })
                : '-'}
            </TableCell>
            <TableCell>
              {record.checkOut
                ? new Date(record.checkOut).toLocaleTimeString([], { hour12: true })
                : '-'}
            </TableCell>
            <TableCell>
              {record.hoursWorked ? record.hoursWorked : '-'}
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(record.status)}>
                {record.status}
              </Badge>
            </TableCell>
          </TableRow>
        );
      })
  ) : (
    <TableRow>
      <TableCell colSpan={6} align="center">
        No attendance records available.
      </TableCell>
    </TableRow>
  )}
</TableBody>

      </Table>
    </CardContent>
  </Card>
</TabsContent>


{/* TODO canViewAllAttendance */}
       
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
                <div className="text-2xl font-bold">{companySummary?.totalEmployees
}</div>
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
                <div className="text-2xl font-bold">{companySummary?.dayShift

}</div>
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
                <div className="text-2xl font-bold">{companySummary?.nightShift

}</div>
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
                <div className="text-2xl font-bold text-green-600">{`${companySummary?.attendanceRate}%`}</div>
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





// {canViewAllAttendance && (
//   <TabsContent value="team-attendance">
//     <Card>
//       <CardHeader>
//         <CardTitle>Team Attendance</CardTitle>
//         <CardDescription>Monitor team attendance across all shifts</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Employee</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Shift</TableHead>
//               <TableHead>Check In</TableHead>
//               <TableHead>Check Out</TableHead>
//               <TableHead>Hours</TableHead>
//               <TableHead>Status</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {/* Safety check: ensure attendance.attendanceRecords is available */}
//             {records?.length ? (
//               records.map((record) => {
//                 const shiftInfo = getShiftInfo(record.shift);
//                 const ShiftIcon = shiftInfo.icon;
//                 return (
//                   <TableRow key={record.id}>
//                     <TableCell className="font-medium">{record.employeeName}</TableCell>
//                     <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
//                     <TableCell>
//                       <Badge className={shiftInfo.color}>
//                         <ShiftIcon className="h-3 w-3 mr-1" />
//                         {record.shift}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>{record.checkIn || '-'}</TableCell>
//                     <TableCell>{record.checkOut || '-'}</TableCell>
//                     <TableCell>{record.hoursWorked || '-'}</TableCell>
//                     <TableCell>
//                       <Badge className={getStatusColor(record.status)}>
//                         {record.status}
//                       </Badge>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   No attendance records available for the team.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   </TabsContent>
// )}
