
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Upload, FileText, Search, Eye, Download, Mail } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useCombinedContext } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import RoleBadge from '@/components/RoleBadge';
import StatusBadge from '@/components/StatusBadge';
import EmployeeDetailView from './EmployeeDetailView';

const EmployeeManagement: React.FC = () => {
  const {user: userEmployeeManagement,  profile } = useCombinedContext();
  const {user} = userEmployeeManagement

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'System Administrator',
      email: 'admin@hris.com',
      role: 'admin',
      department: 'IT',
      position: 'System Admin',
      status: 'active',
      hireDate: '2020-01-15',
      salary: 95000,
      phone: '+1-555-0101',
      avatar: ''
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'hr@hris.com',
      role: 'hr',
      department: 'Human Resources',
      position: 'HR Manager',
      status: 'active',
      hireDate: '2021-03-20',
      salary: 75000,
      phone: '+1-555-0102'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'manager@hris.com',
      role: 'md',
      department: 'Engineering',
      position: 'Team Lead',
      status: 'active',
      hireDate: '2019-08-10',
      salary: 85000,
      phone: '+1-555-0103'
    },
    {
      id: '4',
      name: 'Jane Smith',
      email: 'jane@hris.com',
      role: 'employee',
      department: 'Engineering',
      position: 'Software Developer',
      status: 'active',
      hireDate: '2022-06-15',
      salary: 70000,
      phone: '+1-555-0104'
    },
    {
      id: '5',
      name: 'Alice Johnson',
      email: 'alice@hris.com',
      role: 'employee',
      department: 'Marketing',
      position: 'Marketing Specialist',
      status: 'active',
      hireDate: '2023-01-10',
      salary: 55000,
      phone: '+1-555-0105'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [bulkEmployees, setBulkEmployees] = useState<Partial<Employee>[]>([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee' as Employee['role'],
    department: '',
    position: '',
    salary: '',
    phone: '',
    managerId: '',
    sendInvite: false
  });

  const canManageEmployees = user?.role.toLowerCase() === 'admin' || user?.role.toLowerCase() === 'hr';
  const canViewAllEmployees = user?.role.toLowerCase() === 'admin' || user?.role.toLowerCase() === 'hr';

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an Excel file (.xlsx, .xls) or CSV file",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would use a library like xlsx to parse the file
    // For now, we'll simulate the parsing
    const reader = new FileReader();
    reader.onload = (e) => {
      // Simulate parsing Excel/CSV data
      const mockData: Partial<Employee>[] = [
        { 
          name: 'Alice Brown', 
          email: 'alice.brown@company.com', 
          role: 'employee', 
          department: 'Marketing', 
          position: 'Marketing Specialist',
          phone: '+1-555-0201',
          salary: 55000
        },
        { 
          name: 'Bob Wilson', 
          email: 'bob.wilson@company.com', 
          role: 'employee', 
          department: 'Sales', 
          position: 'Sales Representative',
          phone: '+1-555-0202',
          salary: 50000
        },
        { 
          name: 'Carol Davis', 
          email: 'carol.davis@company.com', 
          role: 'hr', 
          department: 'Human Resources', 
          position: 'HR Specialist',
          phone: '+1-555-0203',
          salary: 60000
        }
      ];

      setBulkEmployees(mockData);
      toast({
        title: "File Uploaded",
        description: `Found ${mockData.length} valid entries`,
      });
    };
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (bulkEmployees.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload a file with employee data first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingBulk(true);

    // Simulate bulk import processing
    setTimeout(() => {
      const newEmployees: Employee[] = bulkEmployees.map((emp, index) => ({
        id: (Date.now() + index).toString(),
        name: emp.name || '',
        email: emp.email || '',
        role: emp.role || 'employee',
        department: emp.department || '',
        position: emp.position || '',
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0],
        salary: emp.salary,
        phone: emp.phone,
        managerId: emp.managerId
      }));

      setEmployees(prev => [...prev, ...newEmployees]);
      setBulkEmployees([]);
      setIsProcessingBulk(false);
      setIsBulkImportOpen(false);

      toast({
        title: "Bulk Import Completed",
        description: `Successfully imported ${newEmployees.length} employees`,
      });
    }, 2000);
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Email,Role,Department,Position,Phone,Salary\nJohn Doe,john.doe@example.com,employee,IT,Software Developer,+1-555-0001,70000\nJane Smith,jane.smith@example.com,hr,Human Resources,HR Manager,+1-555-0002,75000\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Template Downloaded",
      description: "Employee template has been downloaded",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id 
          ? { 
              ...emp, 
              ...formData, 
              salary: formData.salary ? parseInt(formData.salary) : emp.salary 
            }
          : emp
      ));
      toast({
        title: "Employee Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        position: formData.position,
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0],
        salary: formData.salary ? parseInt(formData.salary) : undefined,
        phone: formData.phone,
        managerId: formData.managerId || undefined
      };
      setEmployees(prev => [...prev, newEmployee]);
      
      if (formData.sendInvite) {
        toast({
          title: "Employee Created & Invited",
          description: `${formData.name} has been added and an invitation email has been sent.`,
        });
      } else {
        toast({
          title: "Employee Created",
          description: `${formData.name} has been added successfully.`,
        });
      }
    }

    setIsDialogOpen(false);
    setEditingEmployee(null);
    setFormData({
      name: '', email: '', role: 'employee', department: '', 
      position: '', salary: '', phone: '', managerId: '', sendInvite: false
    });
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      position: employee.position,
      salary: employee.salary?.toString() || '',
      phone: employee.phone || '',
      managerId: employee.managerId || '',
      sendInvite: false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    toast({
      title: "Employee Removed",
      description: "Employee has been removed successfully.",
    });
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedEmployee(null);
  };

  if (showDetailView && selectedEmployee) {
    return <EmployeeDetailView employee={selectedEmployee} onBack={handleBackToList} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <p className="text-gray-600">Manage employee records and information</p>
        </div>
        {canManageEmployees && (
          <div className="flex gap-2">
            <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Import Employees</DialogTitle>
                  <DialogDescription>
                    Upload an Excel or CSV file to import multiple employees at once
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={downloadTemplate} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="bulk-upload"
                      />
                      <label htmlFor="bulk-upload">
                        <Button variant="outline" className="w-full cursor-pointer" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>

                  {bulkEmployees.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Preview ({bulkEmployees.length} entries)</h4>
                      <div className="max-h-40 overflow-y-auto border rounded-md p-3 space-y-2">
                        {bulkEmployees.map((emp, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{emp.name} - {emp.email}</span>
                            <Badge variant="outline" className="capitalize">
                              {emp.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBulkImportOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleBulkImport} 
                    disabled={isProcessingBulk || bulkEmployees.length === 0}
                  >
                    {isProcessingBulk ? "Processing..." : `Import ${bulkEmployees.length} Employees`}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingEmployee ? 'Update employee information' : 'Add a new employee to your organization'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="job">Job Details</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      {!editingEmployee && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="sendInvite"
                            checked={formData.sendInvite}
                            onChange={(e) => setFormData(prev => ({ ...prev, sendInvite: e.target.checked }))}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="sendInvite" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Send invitation email to employee
                          </Label>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="job" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select value={formData.role.toLowerCase()} onValueChange={(value: Employee['role']) => setFormData(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="employee">Employee</SelectItem>
                              <SelectItem value="md">Manager</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                              {user?.role.toLowerCase() === 'admin' && <SelectItem value="admin">Admin</SelectItem>}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Engineering">Engineering</SelectItem>
                              <SelectItem value="Human Resources">Human Resources</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="position">Position</Label>
                          <Input
                            id="position"
                            value={formData.position}
                            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="salary">Salary</Label>
                          <Input
                            id="salary"
                            type="number"
                            value={formData.salary}
                            onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingEmployee ? 'Update' : 'Create'} Employee
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
          <CardDescription>Manage your organization's employees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hire Date</TableHead>
                {canViewAllEmployees && <TableHead>Salary</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                        {employee.phone && (
                          <div className="text-sm text-gray-500">{employee.phone}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={employee.role} size="sm" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.department}</div>
                      <div className="text-sm text-gray-500">{employee.position}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={employee.status} size="sm" />
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </TableCell>
                  {canViewAllEmployees && (
                    <TableCell className="font-medium">
                      {employee.salary ? `$${employee.salary.toLocaleString()}` : 'Not set'}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex space-x-2">
                      {canViewAllEmployees && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(employee)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {canManageEmployees && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user?.role.toLowerCase() === 'admin' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(employee.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
