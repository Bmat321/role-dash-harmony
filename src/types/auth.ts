export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  department?: string;
  position?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'terminated';
  token: string;
}

export interface AuthContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: User | null | any;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string;
}
