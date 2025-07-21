
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Appraisal, AppraisalObjective } from '@/types/appraisal';

interface AppraisalScoringProps {
  appraisal: Appraisal;
  isTeamLead: boolean;
  isEmployee: boolean;
  onBack: () => void;
  onSubmit: (appraisal: Appraisal, action: 'submit' | 'approve' | 'revise') => void;
}

const AppraisalScoring: React.FC<AppraisalScoringProps> = ({
  appraisal,
  isTeamLead,
  isEmployee,
  onBack,
  onSubmit
}) => {
  const [objectives, setObjectives] = useState<AppraisalObjective[]>(appraisal.objectives);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = (isEmployee && ['sent_to_employee', 'needs_revision'].includes(appraisal.status)) ||
                 (isTeamLead && appraisal.status === 'employee_completed');

  const updateObjective = (index: number, field: keyof AppraisalObjective, value: any) => {
    setObjectives(prev => prev.map((obj, i) => 
      i === index ? { ...obj, [field]: value } : obj
    ));
  };

  const calculateTotalScore = () => {
    const employeeTotal = objectives.reduce((sum, obj) => sum + obj.employeeScore, 0);
    const teamLeadTotal = objectives.reduce((sum, obj) => sum + obj.teamLeadScore, 0);
    const finalTotal = objectives.reduce((sum, obj) => sum + obj.finalScore, 0);
    
    return { employee: employeeTotal, teamLead: teamLeadTotal, final: finalTotal };
  };

  const handleSubmit = async (action: 'submit' | 'approve' | 'revise') => {
    setIsSubmitting(true);
    
    const totalScores = calculateTotalScore();
    const updatedAppraisal: Appraisal = {
      ...appraisal,
      objectives,
      totalScore: totalScores,
      updatedAt: new Date().toISOString()
    };

    try {
      await onSubmit(updatedAppraisal, action);
      
      const actionText = action === 'submit' ? 'submitted' : 
                        action === 'approve' ? 'approved' : 'sent for revision';
      
      toast({
        title: "Success",
        description: `Appraisal ${actionText} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appraisal",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'sent_to_employee': 'bg-blue-100 text-blue-800',
      'employee_completed': 'bg-yellow-100 text-yellow-800',
      'needs_revision': 'bg-red-100 text-red-800',
      'approved': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{appraisal.title}</h1>
              <p className="text-gray-600">{appraisal.employeeName} • {appraisal.period}</p>
            </div>
          </div>
          <Badge className={getStatusColor(appraisal.status)}>
            {appraisal.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {isEmployee && (
                <p className="text-blue-700 bg-blue-50 p-3 rounded">
                  📝 <strong>Employee:</strong> Rate yourself on each objective using the sliders. Provide comments and evidence where applicable.
                </p>
              )}
              {isTeamLead && (
                <p className="text-orange-700 bg-orange-50 p-3 rounded">
                  👥 <strong>Team Lead:</strong> Review employee's self-assessment and provide your scores. Add comments for feedback.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Objectives */}
        <div className="space-y-6">
          {objectives.map((objective, index) => (
            <Card key={objective.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{objective.name}</CardTitle>
                    <CardDescription className="mt-2">
                      <strong>KPI:</strong> {objective.kpi}
                    </CardDescription>
                    <CardDescription className="mt-1">
                      <strong>Measurement:</strong> {objective.measurementTracker}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-lg font-semibold">
                    {objective.marks} marks
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Employee Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-blue-700">Employee Score</label>
                    <span className="text-lg font-bold text-blue-700">
                      {objective.employeeScore}/{objective.marks}
                    </span>
                  </div>
                  <Slider
                    value={[objective.employeeScore]}
                    onValueChange={(value) => updateObjective(index, 'employeeScore', value[0])}
                    max={objective.marks}
                    step={0.5}
                    disabled={!canEdit || !isEmployee}
                    className="w-full"
                  />
                  <Textarea
                    placeholder="Employee comments and evidence..."
                    value={objective.employeeComments}
                    onChange={(e) => updateObjective(index, 'employeeComments', e.target.value)}
                    disabled={!canEdit || !isEmployee}
                    className="min-h-[80px]"
                  />
                </div>

                {/* Team Lead Score */}
                {(isTeamLead || objective.teamLeadScore > 0) && (
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <label className="font-medium text-orange-700">Team Lead Score</label>
                      <span className="text-lg font-bold text-orange-700">
                        {objective.teamLeadScore}/{objective.marks}
                      </span>
                    </div>
                    <Slider
                      value={[objective.teamLeadScore]}
                      onValueChange={(value) => updateObjective(index, 'teamLeadScore', value[0])}
                      max={objective.marks}
                      step={0.5}
                      disabled={!canEdit || !isTeamLead}
                      className="w-full"
                    />
                    <Textarea
                      placeholder="Team lead comments and feedback..."
                      value={objective.teamLeadComments}
                      onChange={(e) => updateObjective(index, 'teamLeadComments', e.target.value)}
                      disabled={!canEdit || !isTeamLead}
                      className="min-h-[80px]"
                    />
                  </div>
                )}

                {/* Score Comparison */}
                {objective.employeeScore > 0 && objective.teamLeadScore > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Score Comparison</h4>
                    <div className="flex justify-between items-center text-sm">
                      <span>Employee: {objective.employeeScore}</span>
                      <span>Team Lead: {objective.teamLeadScore}</span>
                      <span className={`font-medium ${
                        objective.employeeScore === objective.teamLeadScore ? 'text-green-600' :
                        objective.teamLeadScore < objective.employeeScore ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {objective.employeeScore === objective.teamLeadScore ? 'Match' :
                         objective.teamLeadScore < objective.employeeScore ? 'Reduced' : 'Increased'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total Score Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Score Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {calculateTotalScore().employee.toFixed(1)}
                </div>
                <div className="text-sm text-blue-600">Employee Total</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">
                  {calculateTotalScore().teamLead.toFixed(1)}
                </div>
                <div className="text-sm text-orange-600">Team Lead Total</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  100.0
                </div>
                <div className="text-sm text-green-600">Maximum Possible</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {canEdit && (
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            {isEmployee && (
              <Button
                onClick={() => handleSubmit('submit')}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit to Team Lead'}
              </Button>
            )}
            {isTeamLead && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSubmit('revise')}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  {isSubmitting ? 'Processing...' : 'Send for Revision'}
                </Button>
                <Button
                  onClick={() => handleSubmit('approve')}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isSubmitting ? 'Processing...' : 'Approve & Send to HR'}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppraisalScoring;
