
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
  budget?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  totalEmployees: number;
  averageEmployeesPerDept: number;
}
