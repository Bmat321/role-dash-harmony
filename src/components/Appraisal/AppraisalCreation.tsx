
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Appraisal, AppraisalObjective } from '@/types/appraisal';
import { defaultAppraisalTemplate } from '@/data/appraisalTemplate';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface AppraisalCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAppraisal: (appraisal: Appraisal) => void;
  currentUser: any;
  employees: Employee[];
}

const AppraisalCreation: React.FC<AppraisalCreationProps> = ({
  isOpen,
  onClose,
  onCreateAppraisal,
  currentUser,
  employees
}) => {
  const [formData, setFormData] = useState({
    title: '',
    period: '',
    dueDate: '',
    selectedEmployees: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.selectedEmployees.length === 0) {
      toast({
        title: "No Employees Selected",
        description: "Please select at least one employee for the appraisal.",
        variant: "destructive"
      });
      return;
    }

    formData.selectedEmployees.forEach(employeeId => {
      const employee = employees.find(emp => emp.id === employeeId);
      if (!employee) return;

      const objectives: AppraisalObjective[] = defaultAppraisalTemplate.objectives.map((obj, index) => ({
        id: `obj-${index}`,
        ...obj,
        employeeScore: 0,
        teamLeadScore: 0,
        finalScore: 0,
        employeeComments: '',
        teamLeadComments: '',
        evidence: ''
      }));

      const newAppraisal: Appraisal = {
        id: `appraisal-${Date.now()}-${employeeId}`,
        employeeId: employeeId,
        employeeName: employee.name,
        teamLeadId: currentUser?.id || '',
        teamLeadName: currentUser?.name || '',
        title: formData.title,
        period: formData.period,
        dueDate: formData.dueDate,
        status: 'sent_to_employee',
        objectives,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalScore: {
          employee: 0,
          teamLead: 0,
          final: 0
        }
      };

      onCreateAppraisal(newAppraisal);
    });

    toast({
      title: "Appraisals Created",
      description: `Appraisals sent to ${formData.selectedEmployees.length} employee(s)`,
    });

    // Reset form
    setFormData({
      title: '',
      period: '',
      dueDate: '',
      selectedEmployees: []
    });
    onClose();
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(employeeId)
        ? prev.selectedEmployees.filter(id => id !== employeeId)
        : [...prev.selectedEmployees, employeeId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Create Performance Appraisal
          </DialogTitle>
          <DialogDescription>
            Set up a new appraisal based on company objectives and send to selected employees
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Appraisal Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Q1 2024 Performance Review"
                required
              />
            </div>
            <div>
              <Label htmlFor="period">Review Period</Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                placeholder="e.g., January - March 2024"
                required
              />
            </div>
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

          <div>
            <Label className="text-base font-medium">Select Employees</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {employees.map(employee => (
                <div
                  key={employee.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.selectedEmployees.includes(employee.id)
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleEmployeeSelection(employee.id)}
                >
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-gray-600">{employee.email}</div>
                    <Badge variant="outline" className="text-xs">{employee.department}</Badge>
                  </div>
                  <div className={`w-4 h-4 rounded border-2 ${
                    formData.selectedEmployees.includes(employee.id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.selectedEmployees.includes(employee.id) && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {formData.selectedEmployees.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {formData.selectedEmployees.length} employee(s) selected
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appraisal Structure Preview</CardTitle>
              <CardDescription>
                This appraisal includes {defaultAppraisalTemplate.objectives.length} objectives totaling 100 marks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  defaultAppraisalTemplate.objectives.reduce((acc, obj) => {
                    if (!acc[obj.category]) acc[obj.category] = [];
                    acc[obj.category].push(obj);
                    return acc;
                  }, {} as Record<string, typeof defaultAppraisalTemplate.objectives>)
                ).map(([category, objectives]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">{category.replace('_', ' ')}</h4>
                    <div className="ml-4 space-y-1">
                      {objectives.map((obj, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{obj.name}</span>
                          <Badge variant="outline">{obj.marks} marks</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={formData.selectedEmployees.length === 0}>
              <Send className="h-4 w-4 mr-2" />
              Send Appraisals ({formData.selectedEmployees.length})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppraisalCreation;
