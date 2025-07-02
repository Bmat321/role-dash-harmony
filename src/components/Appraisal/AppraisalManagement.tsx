import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar as CalendarIcon, Check, X, Clock, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import AppraisalScoring from './AppraisalScoring';

interface Appraisal {
  id: string;
  employeeId: string;
  employeeName: string;
  templateId: string;
  title: string;
  type: AppraisalType;
  period: string;
  dueDate: string;
  status: 'pending' | 'inProgress' | 'completed';
  createdBy: string;
  createdAt: string;
  criteria: AppraisalCriteria[];
}

interface AppraisalTemplate {
  id: string;
  name: string;
  description: string;
  criteria: AppraisalCriteria[];
  createdBy: string;
  createdAt: string;
}

interface AppraisalCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  employeeScore: number;
  managerScore: number;
  finalScore: number;
  comments: string;
}

type AppraisalType = 'monthly' | 'quarterly' | 'annual';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

const mockEmployees: Employee[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', department: 'IT' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', department: 'HR' },
  { id: '3', name: 'Mike Wilson', email: 'mike.wilson@example.com', department: 'Finance' },
  { id: '4', name: 'Emily Johnson', email: 'emily.johnson@example.com', department: 'Marketing' }
];

const mockAppraisals: Appraisal[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    templateId: '1',
    title: 'January Performance Appraisal',
    type: 'monthly',
    period: 'January 2024',
    dueDate: '2024-02-15',
    status: 'completed',
    createdBy: 'admin',
    createdAt: '2024-01-01',
    criteria: [
      { id: 'c1', name: 'Quality of Work', description: 'Accuracy and thoroughness', weight: 30, employeeScore: 4, managerScore: 5, finalScore: 4.5, comments: 'Excellent work this month' },
      { id: 'c2', name: 'Teamwork', description: 'Collaboration and support', weight: 20, employeeScore: 5, managerScore: 5, finalScore: 5, comments: 'Great team player' },
      { id: 'c3', name: 'Initiative', description: 'Proactiveness and innovation', weight: 25, employeeScore: 4, managerScore: 4, finalScore: 4, comments: 'Shows good initiative' },
      { id: 'c4', name: 'Attendance', description: 'Punctuality and presence', weight: 25, employeeScore: 5, managerScore: 5, finalScore: 5, comments: 'Perfect attendance' }
    ]
  }
];

const mockTemplates: AppraisalTemplate[] = [
  {
    id: '1',
    name: 'Monthly Performance Template',
    description: 'Template for monthly performance appraisals',
    createdBy: 'admin',
    createdAt: '2024-01-01',
    criteria: [
      { id: 'c1', name: 'Quality of Work', description: 'Accuracy and thoroughness', weight: 30, employeeScore: 0, managerScore: 0, finalScore: 0, comments: '' },
      { id: 'c2', name: 'Teamwork', description: 'Collaboration and support', weight: 20, employeeScore: 0, managerScore: 0, finalScore: 0, comments: '' },
      { id: 'c3', name: 'Initiative', description: 'Proactiveness and innovation', weight: 25, employeeScore: 0, managerScore: 0, finalScore: 0, comments: '' },
      { id: 'c4', name: 'Attendance', description: 'Punctuality and presence', weight: 25, employeeScore: 0, managerScore: 0, finalScore: 0, comments: '' }
    ]
  }
];

const AppraisalManagement: React.FC = () => {
  const { user } = useAuth();
  const [appraisals, setAppraisals] = useState<Appraisal[]>(mockAppraisals);
  const [templates, setTemplates] = useState<AppraisalTemplate[]>(mockTemplates);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedAppraisal, setSelectedAppraisal] = useState<Appraisal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'monthly' as AppraisalType,
    dueDate: '',
    criteria: [] as AppraisalCriteria[]
  });

  const canManageAppraisals = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager';

  const handleCreateAppraisal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !selectedTemplate) {
      toast({
        title: "Missing Information",
        description: "Please select an employee and template.",
        variant: "destructive"
      });
      return;
    }

    const template = templates.find(t => t.id === selectedTemplate);
    const employee = mockEmployees.find(e => e.id === selectedEmployee);
    
    if (!template || !employee) return;

    const newAppraisal: Appraisal = {
      id: Date.now().toString(),
      employeeId: selectedEmployee,
      employeeName: employee.name,
      templateId: selectedTemplate,
      title: formData.title,
      type: formData.type,
      period: getPeriodString(formData.type),
      dueDate: formData.dueDate,
      status: 'pending',
      createdBy: user?.id || '',
      createdAt: new Date().toISOString(),
      criteria: template.criteria.map(criterion => ({
        ...criterion,
        employeeScore: 0,
        managerScore: 0,
        finalScore: 0,
        comments: ''
      }))
    };

    setAppraisals(prev => [newAppraisal, ...prev]);
    
    // Reset form and close dialog
    setFormData({
      title: '',
      type: 'monthly',
      dueDate: '',
      criteria: []
    });
    setSelectedEmployee('');
    setSelectedTemplate('');
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Appraisal Created",
      description: `Appraisal for ${employee.name} has been created and sent.`,
    });
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.criteria.length === 0) {
      toast({
        title: "No Criteria",
        description: "Please add at least one appraisal criterion.",
        variant: "destructive"
      });
      return;
    }

    const totalWeight = formData.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    
    if (totalWeight !== 100) {
      toast({
        title: "Invalid Weights",
        description: "Total weight of all criteria must equal 100%.",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: AppraisalTemplate = {
      id: Date.now().toString(),
      name: formData.title,
      description: `${formData.type} appraisal template`,
      criteria: formData.criteria,
      createdBy: user?.id || '',
      createdAt: new Date().toISOString()
    };

    setTemplates(prev => [newTemplate, ...prev]);
    
    // Reset form and close dialog
    setFormData({
      title: '',
      type: 'monthly',
      dueDate: '',
      criteria: []
    });
    setIsTemplateDialogOpen(false);
    
    toast({
      title: "Template Created",
      description: "Appraisal template has been created successfully.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newCriteria = [...prev.criteria];
      newCriteria[index] = { ...newCriteria[index], [name]: value };
      return { ...prev, criteria: newCriteria };
    });
  };

  const handleAddCriterion = () => {
    setFormData(prev => ({
      ...prev,
      criteria: [...prev.criteria, { id: Date.now().toString(), name: '', description: '', weight: 0, employeeScore: 0, managerScore: 0, finalScore: 0, comments: '' }]
    }));
  };

  const handleRemoveCriterion = (index: number) => {
    setFormData(prev => {
      const newCriteria = [...prev.criteria];
      newCriteria.splice(index, 1);
      return { ...prev, criteria: newCriteria };
    });
  };

  const getPeriodString = (type: AppraisalType): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString('default', { month: 'long' });

    switch (type) {
      case 'monthly':
        return `${month} ${year}`;
      case 'quarterly':
        const quarter = Math.floor((now.getMonth() / 3) + 1);
        return `Q${quarter} ${year}`;
      case 'annual':
        return `${year}`;
      default:
        return 'Unknown';
    }
  };

  const handleViewAppraisal = (appraisal: Appraisal) => {
    setSelectedAppraisal(appraisal);
  };

  const handleAppraisalUpdate = (updatedCriteria: AppraisalCriteria[], totalScore: number) => {
    if (!selectedAppraisal) return;

    setAppraisals(prev => prev.map(appraisal => {
      if (appraisal.id === selectedAppraisal.id) {
        return {
          ...appraisal,
          criteria: updatedCriteria,
          status: 'inProgress' // Update status based on workflow
        };
      }
      return appraisal;
    }));

    setSelectedAppraisal(null);
  };

  if (selectedAppraisal) {
    return (
      <AppraisalScoring
        appraisalId={selectedAppraisal.id}
        title={selectedAppraisal.title}
        employeeName={selectedAppraisal.employeeName}
        criteria={selectedAppraisal.criteria}
        isManager={canManageAppraisals}
        status="employee_pending"
        onBack={() => setSelectedAppraisal(null)}
        onSubmit={handleAppraisalUpdate}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Appraisal Management</h2>
          <p className="text-gray-600">Manage employee performance appraisals</p>
        </div>
        {canManageAppraisals && (
          <div className="flex gap-2">
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Appraisal Template</DialogTitle>
                  <DialogDescription>
                    Define a new template for performance appraisals
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTemplate}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Template Name</Label>
                      <Input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Appraisal Type</Label>
                      <Select value={formData.type} onValueChange={(value: AppraisalType) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Appraisal Criteria</Label>
                      <div className="space-y-2">
                        {formData.criteria.map((criterion, index) => (
                          <Card key={criterion.id} className="border">
                            <CardContent className="space-y-2">
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label htmlFor={`name-${index}`}>Name</Label>
                                  <Input
                                    id={`name-${index}`}
                                    type="text"
                                    name="name"
                                    value={criterion.name}
                                    onChange={(e) => handleInputChange(e, index)}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`weight-${index}`}>Weight (%)</Label>
                                  <Input
                                    id={`weight-${index}`}
                                    type="number"
                                    name="weight"
                                    value={criterion.weight}
                                    onChange={(e) => handleInputChange(e, index)}
                                    required
                                  />
                                </div>
                                <div>
                                  <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveCriterion(index)}>
                                    Remove
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`description-${index}`}>Description</Label>
                                <Textarea
                                  id={`description-${index}`}
                                  name="description"
                                  value={criterion.description}
                                  onChange={(e) => handleInputChange(e, index)}
                                  required
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <Button type="button" variant="secondary" onClick={handleAddCriterion}>
                          Add Criterion
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Template</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Appraisal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Appraisal</DialogTitle>
                  <DialogDescription>
                    Assign an appraisal to an employee using a predefined template
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateAppraisal}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="employee">Employee</Label>
                      <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockEmployees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name} - {employee.department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="template">Template</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="title">Appraisal Title</Label>
                      <Input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Appraisal Type</Label>
                      <Select value={formData.type} onValueChange={(value: AppraisalType) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Appraisal</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Appraisals</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Appraisals</CardTitle>
              <CardDescription>List of ongoing performance appraisals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appraisals.map((appraisal) => (
                    <TableRow key={appraisal.id}>
                      <TableCell className="font-medium">{appraisal.employeeName}</TableCell>
                      <TableCell>{appraisal.title}</TableCell>
                      <TableCell>{appraisal.type}</TableCell>
                      <TableCell>{new Date(appraisal.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{appraisal.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewAppraisal(appraisal)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Appraisal Templates</CardTitle>
              <CardDescription>List of available appraisal templates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.description}</TableCell>
                      <TableCell>{mockEmployees.find(e => e.id === template.createdBy)?.name || 'System'}</TableCell>
                      <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="archive">
          <Card>
            <CardHeader>
              <CardTitle>Archived Appraisals</CardTitle>
              <CardDescription>List of completed performance appraisals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appraisals.filter(appraisal => appraisal.status === 'completed').map((appraisal) => (
                    <TableRow key={appraisal.id}>
                      <TableCell className="font-medium">{appraisal.employeeName}</TableCell>
                      <TableCell>{appraisal.title}</TableCell>
                      <TableCell>{appraisal.type}</TableCell>
                      <TableCell>{new Date(appraisal.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{appraisal.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppraisalManagement;
