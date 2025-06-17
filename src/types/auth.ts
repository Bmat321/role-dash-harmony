
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  department?: string;
  position?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'terminated';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
