export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  profileImage?: string; 
  position?: string;
  startDate?: Date;
  skills?: string[];
  education?: string;
  workExperience?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  role: 'admin' | 'hr' | 'hod' | 'manager' | 'employee' | 'teamlead';
  biometryId?: string;
  department: string;
  companyId: string; // flattened from mongoose ObjectId
  status: 'active' | 'inactive' | 'terminated';
  token: string
}

// The wrapper interface that contains the user property
export interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  code: string | null;  
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}


export interface  Verify2fa  {
  user?: User;
  token: string | null;
  refreshToken?: string | null;
};

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  verify2fa: (email: string,code: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  clearError: () => void;
}