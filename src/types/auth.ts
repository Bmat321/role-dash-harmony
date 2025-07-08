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
  role: 'Admin' | 'HR' | 'HOD' | 'Manager' | 'Employee' | 'TeamLead';
  biometryId?: string;
  department: string;
  companyId: string; // flattened from mongoose ObjectId
  status: 'active' | 'inactive' | 'terminated';
  token: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// The wrapper interface that contains the user property
export interface UserState {
  user: User;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: User | null | any;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string;
}
