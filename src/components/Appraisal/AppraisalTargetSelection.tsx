
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Appraisal } from '@/types/appraisal';
import { availableTargets, AppraisalTarget } from '@/data/appraisalTargets';

interface AppraisalTargetSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAppraisal: (appraisal: Appraisal) => void;
  currentUser: any;
  employees: Array<{ id: string; name: string; email: string; department: string; }>;
}

const AppraisalTargetSelection: React.FC<AppraisalTargetSelectionProps> = ({
  isOpen,
  onClose,
  onCreateAppraisal,
  currentUser,
  employees
}) => {
  const [step, setStep] = useState<'basic' | 'targets' | 'preview'>('basic');
  const [formData, setFormData] = useState({
    title: '',
    employeeId: '',
    period: 'monthly',
    dueDate: null as Date | null,
  });
  const [selectedTargets, setSelectedTargets] = useState<AppraisalTarget[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleTargetToggle = (target: AppraisalTarget) => {
    setSelectedTargets(prev => {
      const exists = prev.find(t => t.id === target.id);
      if (exists) {
        return prev.filter(t => t.id !== target.id);
      } else {
        return [...prev, target];
      }
    });
  };

  const getTotalScore = () => {
    return selectedTargets.reduce((sum, target) => sum + target.marks, 0);
  };

  const getTargetsByCategory = () => {
    const categories = ['OBJECTIVES', 'FINANCIAL', 'CUSTOMER_SERVICE', 'INTERNAL_PROCESS', 'LEARNING_AND_GROWTH'] as const;
    return categories.map(category => ({
      category,
      targets: availableTargets.filter(t => t.category === category)
    }));
  };

  const handleNextStep = () => {
    if (step === 'basic') {
      setStep('targets');
    } else if (step === 'targets') {
      setStep('preview');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'targets') {
      setStep('basic');
    } else if (step === 'preview') {
      setStep('targets');
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.employeeId || !formData.dueDate || selectedTargets.length === 0) {
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
      objectives: selectedTargets.map((target, index) => ({
        id: `obj_${target.id}_${index}`,
        category: target.category,
        name: target.name,
        marks: target.marks,
        kpi: target.kpi,
        measurementTracker: target.measurementTracker,
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
    handleClose();
  };

  const handleClose = () => {
    setStep('basic');
    setFormData({
      title: '',
      employeeId: '',
      period: 'monthly',
      dueDate: null,
    });
    setSelectedTargets([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'basic' && 'Create New Appraisal'}
            {step === 'targets' && 'Select Targets'}
            {step === 'preview' && 'Preview Appraisal'}
          </DialogTitle>
          <DialogDescription>
            {step === 'basic' && 'Set up basic information for the appraisal.'}
            {step === 'targets' && `Select targets for evaluation (Total: ${getTotalScore()}/100 marks)`}
            {step === 'preview' && 'Review your appraisal before sending to employee.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'basic' && (
          <div className="space-y-4">
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
              <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
        )}

        {step === 'targets' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Selected Targets: {selectedTargets.length}</span>
              <Badge variant={getTotalScore() === 100 ? "default" : "outline"}>
                Total Score: {getTotalScore()}/100
              </Badge>
            </div>

            {getTargetsByCategory().map(({ category, targets }) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{category.replace('_', ' ')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {targets.map((target) => (
                    <div key={target.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={selectedTargets.some(t => t.id === target.id)}
                        onCheckedChange={() => handleTargetToggle(target)}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{target.name}</h4>
                          <Badge variant="outline">{target.marks} marks</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{target.kpi}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appraisal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Title:</strong> {formData.title}</div>
                <div><strong>Employee:</strong> {employees.find(e => e.id === formData.employeeId)?.name}</div>
                <div><strong>Period:</strong> {formData.period}</div>
                <div><strong>Due Date:</strong> {formData.dueDate ? format(formData.dueDate, "PPP") : 'Not set'}</div>
                <div><strong>Total Score:</strong> {getTotalScore()}/100 marks</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Targets ({selectedTargets.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedTargets.map((target) => (
                  <div key={target.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{target.name}</h4>
                      <p className="text-sm text-gray-600">{target.category.replace('_', ' ')}</p>
                    </div>
                    <Badge>{target.marks} marks</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div>
            {step !== 'basic' && (
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {step !== 'preview' ? (
              <Button 
                type="button" 
                onClick={handleNextStep}
                disabled={
                  (step === 'basic' && (!formData.title || !formData.employeeId || !formData.dueDate)) ||
                  (step === 'targets' && selectedTargets.length === 0)
                }
              >
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit}>
                Send to Employee
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppraisalTargetSelection;
