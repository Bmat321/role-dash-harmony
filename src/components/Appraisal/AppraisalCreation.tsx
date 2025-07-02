
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Appraisal } from '@/types/appraisal';
import { appraisalTemplate } from '@/data/appraisalTemplate';

interface AppraisalCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAppraisal: (appraisal: Appraisal) => void;
  currentUser: any;
  employees: Array<{ id: string; name: string; email: string; department: string; }>;
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
    employeeId: '',
    period: '',
    dueDate: null as Date | null,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.employeeId || !formData.period || !formData.dueDate) {
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
    if (!selectedEmployee) return;

    const newAppraisal: Appraisal = {
      id: `appr_${Date.now()}`,
      employeeId: formData.employeeId,
      employeeName: selectedEmployee.name,
      teamLeadId: currentUser?.id || '',
      teamLeadName: currentUser?.name || '',
      title: formData.title,
      period: formData.period,
      dueDate: formData.dueDate.toISOString(),
      status: 'sent_to_employee',
      objectives: appraisalTemplate.objectives.map((template, index) => ({
        id: `obj_${index}`,
        category: template.category,
        name: template.name,
        marks: template.marks,
        kpi: template.kpi,
        measurementTracker: template.measurementTracker,
        employeeScore: 0,
        teamLeadScore: 0,
        finalScore: 0,
        employeeComments: '',
        teamLeadComments: '',
        evidence: ''
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalScore: {
        employee: 0,
        teamLead: 0,
        final: 0
      }
    };

    onCreateAppraisal(newAppraisal);
    onClose();
    setFormData({
      title: '',
      employeeId: '',
      period: '',
      dueDate: null,
      description: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Appraisal</DialogTitle>
          <DialogDescription>
            Set up a new performance appraisal for your team member.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Appraisal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Q4 2024 Performance Review"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee">Select Employee</Label>
            <Select value={formData.employeeId} onValueChange={(value) => setFormData({ ...formData, employeeId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Review Period</Label>
            <Input
              id="period"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              placeholder="Q4 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate || undefined}
                  onSelect={(date) => setFormData({ ...formData, dueDate: date || null })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Appraisal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppraisalCreation;
