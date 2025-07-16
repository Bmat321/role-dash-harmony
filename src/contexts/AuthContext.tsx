
// import React, { createContext, useContext } from 'react';
// import { AuthContextType } from '@/types/auth';
// import { useReduxAuth } from '@/hooks/useReduxAuth';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const reduxAuth = useReduxAuth();

//   // Add error boundary to prevent crashes
//   if (!reduxAuth) {
//     console.error('useReduxAuth returned undefined');
//     return <div>Loading authentication...</div>;
//   }

//   return (
//     <AuthContext.Provider value={reduxAuth}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';

import { useReduxAuth } from '@/hooks/auth/useReduxAuth';
import { useReduxProfile } from '@/hooks/user/useReduxProfile';
import { ProfileContextType } from '@/types/user';
import { useReduxAttendance } from '@/hooks/attendance/useReduxAttendance';
import { AttendanceContextType } from '@/types/attendance';
import { useReduxLeave } from '@/hooks/leave/useReduxLeave';
import { UseReduxLeaveReturnType } from '@/types/leave';
import { HandoverContextType } from '@/types/handover';
import { useReduxHandover } from '@/hooks/handover/useReduxHandover';


const CombinedContext = createContext<{
  user: AuthContextType;
  profile: ProfileContextType;
  attendance: AttendanceContextType
  leave: UseReduxLeaveReturnType
  handover: HandoverContextType
} | undefined>(undefined);

export const CombinedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useReduxAuth();
  const profile = useReduxProfile();
  const attendance = useReduxAttendance()
  const leave = useReduxLeave()
  const handover = useReduxHandover()

  // Check if auth and profile are undefined
  if (!user || !profile || !attendance || !leave ||!handover) {
    console.error('useReduxAuth or useReduxProfile returned undefined');
    return <div>Loading...</div>;
  }

  return (
    <CombinedContext.Provider value={{ user, profile , attendance, leave, handover}}>
      {children}
    </CombinedContext.Provider>
  );
};

// Custom hook to access the combined context
// eslint-disable-next-line react-refresh/only-export-components
export const useCombinedContext = () => {
  const context = useContext(CombinedContext);
  if (!context) {
    throw new Error('useCombinedContext must be used within CombinedProvider');
  }
  return context;
};
