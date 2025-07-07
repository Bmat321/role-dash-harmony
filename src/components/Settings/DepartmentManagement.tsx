
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Department } from '@/types/department';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and technical operations',
    managerId: '3',
    managerName: 'Mike Wilson',
    employeeCount: 25,
    budget: 500000,
    status: 'active',
    createdAt: '2023-01-15',
    updatedAt: '2023-12-01'
  },
  {
    id: '2',
    name: 'Human Resources',
    description: 'Employee relations and talent management',
    managerId: '2',
    managerName: 'Sarah Johnson',
    employeeCount: 8,
    budget: 200000,
    status: 'active',
    createdAt: '2023-01-15',
    updatedAt: '2023-11-15'
  },
  {
    id: '3',
    name: 'Marketing',
    description: 'Brand promotion and customer acquisition',
    employeeCount: 12,
    budget: 150000,
    status: 'active',
    createdAt: '2023-02-01',
    updatedAt: '2023-10-20'
  }
];

const DepartmentManagement: React.FC = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: '',
    budget: ''
  });

  if (user?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDepartment) {
      // Update existing department
      setDepartments(prev => prev.map(dept => 
        dept.id === editingDepartment.id 
          ? {
              ...dept,
              name: formData.name,
              description: formData.description,
              managerId: formData.managerId || undefined,
              budget: formData.budget ? parseInt(formData.budget, 10) : undefined,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : dept
      ));
      toast({
        title: "Department Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      // Create new department
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId || undefined,
        managerName: formData.managerId ? 'Manager Name' : undefined,
        employeeCount: 0,
        budget: formData.budget ? parseInt(formData.budget, 10) : undefined,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setDepartments(prev => [...prev, newDepartment]);
      toast({
        title: "Department Created",
        description: `${formData.name} has been created successfully.`,
      });
    }

    setIsDialogOpen(false);
    setEditingDepartment(null);
    setFormData({ name: '', description: '', managerId: '', budget: '' });
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
      managerId: department.managerId || '',
      budget: department.budget?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (departmentId: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
    toast({
      title: "Department Deleted",
      description: "Department has been removed successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Department Management</h2>
          <p className="text-gray-600">Create and manage company departments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Edit Department' : 'Create New Department'}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment ? 'Update department information' : 'Add a new department to your organization'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="managerId">Department Manager</Label>
                  <Select value={formData.managerId} onValueChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Sarah Johnson</SelectItem>
                      <SelectItem value="3">Mike Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget (Optional)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="Enter budget amount"
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDepartment ? 'Update' : 'Create'} Department
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>Manage your organization's departments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{department.name}</div>
                      <div className="text-sm text-gray-500">{department.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{department.managerName || 'Not assigned'}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {department.employeeCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    {department.budget ? `$${department.budget.toLocaleString()}` : 'Not set'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={department.status === 'active' ? 'default' : 'secondary'}>
                      {department.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(department)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(department.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default DepartmentManagement;
