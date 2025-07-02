
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Send, CheckCircle, AlertTriangle, Info, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Appraisal, AppraisalObjective } from '@/types/appraisal';

interface AppraisalScoringProps {
  appraisal: Appraisal;
  isTeamLead: boolean;
  isEmployee: boolean;
  onBack: () => void;
  onSubmit: (updatedAppraisal: Appraisal, action: 'submit' | 'approve' | 'revise') => void;
}

const AppraisalScoring: React.FC<AppraisalScoringProps> = ({
  appraisal,
  isTeamLead,
  isEmployee,
  onBack,
  onSubmit
}) => {
  const [objectives, setObjectives] = useState<AppraisalObjective[]>(appraisal.objectives);
  const [revisionReason, setRevisionReason] = useState('');

  const canEdit = (isEmployee && appraisal.status === 'sent_to_employee') || 
                 (isTeamLead && appraisal.status === 'employee_completed');

  const handleScoreChange = (objectiveId: string, score: number) => {
    if (!canEdit) return;

    setObjectives(prev => prev.map(obj => {
      if (obj.id === objectiveId) {
        if (isEmployee) {
          return { ...obj, employeeScore: score };
        } else if (isTeamLead) {
          return { ...obj, teamLeadScore: score };
        }
      }
      return obj;
    }));
  };

  const handleCommentChange = (objectiveId: string, comment: string) => {
    if (!canEdit) return;

    setObjectives(prev => prev.map(obj => {
      if (obj.id === objectiveId) {
        if (isEmployee) {
          return { ...obj, employeeComments: comment };
        } else if (isTeamLead) {
          return { ...obj, teamLeadComments: comment };
        }
      }
      return obj;
    }));
  };

  const calculateTotalScore = (type: 'employee' | 'teamLead') => {
    return objectives.reduce((total, obj) => {
      const score = type === 'employee' ? obj.employeeScore : obj.teamLeadScore;
      const percentage = (score / 5) * 100; // Convert 0-5 scale to percentage
      return total + (percentage * obj.marks / 100);
    }, 0);
  };

  const getScoreColor = (score: number) => {
    const percentage = (score / 5) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = () => {
    switch (appraisal.status) {
      case 'sent_to_employee':
        return <Badge variant="outline" className="bg-blue-50">Awaiting Employee</Badge>;
      case 'employee_completed':
        return <Badge variant="outline" className="bg-yellow-50">Awaiting Team Lead Review</Badge>;
      case 'needs_revision':
        return <Badge variant="outline" className="bg-red-50">Needs Revision</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50">Approved</Badge>;
      case 'hr_review':
        return <Badge variant="outline" className="bg-purple-50">HR Review</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const handleSubmit = (action: 'submit' | 'approve' | 'revise') => {
    const employeeTotal = calculateTotalScore('employee');
    const teamLeadTotal = calculateTotalScore('teamLead');

    const updatedAppraisal: Appraisal = {
      ...appraisal,
      objectives,
      totalScore: {
        employee: employeeTotal,
        teamLead: teamLeadTotal,
        final: action === 'approve' ? teamLeadTotal : 0
      },
      updatedAt: new Date().toISOString(),
      revisionReason: action === 'revise' ? revisionReason : undefined
    };

    onSubmit(updatedAppraisal, action);

    if (action === 'submit') {
      toast({
        title: "Appraisal Submitted",
        description: "Your self-assessment has been submitted for review.",
      });
    } else if (action === 'approve') {
      toast({
        title: "Appraisal Approved",
        description: "The appraisal has been approved and sent to HR.",
      });
    } else if (action === 'revise') {
      toast({
        title: "Revision Requested",
        description: "The appraisal has been sent back for revision.",
      });
    }
  };

  const checkScoreAlignment = () => {
    const differences = objectives.map(obj => ({
      name: obj.name,
      diff: Math.abs(obj.employeeScore - obj.teamLeadScore),
      employeeScore: obj.employeeScore,
      teamLeadScore: obj.teamLeadScore
    })).filter(obj => obj.diff > 0.5); // Significant difference threshold

    return differences;
  };

  const scoreAlignment = checkScoreAlignment();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <Button variant="outline" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{appraisal.title}</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Employee: {appraisal.employeeName} | Period: {appraisal.period}
            </p>
          </div>
          <div className="shrink-0">
            {getStatusBadge()}
          </div>
        </div>

        {/* Total Score Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Employee Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {calculateTotalScore('employee').toFixed(1)}/100
              </div>
              <Progress value={calculateTotalScore('employee')} className="mt-2" />
            </CardContent>
          </Card>

          {appraisal.status !== 'sent_to_employee' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Team Lead Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {calculateTotalScore('teamLead').toFixed(1)}/100
                </div>
                <Progress value={calculateTotalScore('teamLead')} className="mt-2" />
              </CardContent>
            </Card>
          )}

          {scoreAlignment.length > 0 && isTeamLead && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Score Differences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  {scoreAlignment.length} objectives have significant score differences
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Revision Notice */}
        {appraisal.status === 'needs_revision' && appraisal.revisionReason && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Revision Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{appraisal.revisionReason}</p>
            </CardContent>
          </Card>
        )}

        {/* Objectives Scoring */}
        <div className="space-y-6">
          {Object.entries(
            objectives.reduce((acc, obj) => {
              if (!acc[obj.category]) acc[obj.category] = [];
              acc[obj.category].push(obj);
              return acc;
            }, {} as Record<string, AppraisalObjective[]>)
          ).map(([category, categoryObjectives]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-xl">{category.replace('_', ' ')}</CardTitle>
                <CardDescription>
                  Total marks: {categoryObjectives.reduce((sum, obj) => sum + obj.marks, 0)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {categoryObjectives.map((objective) => (
                  <div key={objective.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-medium text-lg">{objective.name}</h4>
                      <Badge variant="outline" className="shrink-0">{objective.marks} marks</Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Key Performance Indicator</Label>
                      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">{objective.kpi}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Measurement Tracker</Label>
                      <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">{objective.measurementTracker}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Employee Score */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Employee Self-Assessment</Label>
                        <div className="space-y-2">
                          <Slider
                            value={[objective.employeeScore]}
                            onValueChange={([value]) => isEmployee && canEdit && handleScoreChange(objective.id, value)}
                            max={5}
                            min={0}
                            step={0.1}
                            disabled={!isEmployee || !canEdit}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0 (Poor)</span>
                            <span className={`font-bold ${getScoreColor(objective.employeeScore)}`}>
                              {objective.employeeScore.toFixed(1)}/5
                            </span>
                            <span>5 (Excellent)</span>
                          </div>
                        </div>
                        <Textarea
                          value={objective.employeeComments}
                          onChange={(e) => handleCommentChange(objective.id, e.target.value)}
                          placeholder="Add your comments and evidence..."
                          disabled={!isEmployee || !canEdit}
                          className="min-h-[80px] text-sm"
                        />
                      </div>

                      {/* Team Lead Score */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Team Lead Assessment</Label>
                        <div className="space-y-2">
                          <Slider
                            value={[objective.teamLeadScore]}
                            onValueChange={([value]) => isTeamLead && canEdit && handleScoreChange(objective.id, value)}
                            max={5}
                            min={0}
                            step={0.1}
                            disabled={!isTeamLead || !canEdit}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0 (Poor)</span>
                            <span className={`font-bold ${getScoreColor(objective.teamLeadScore)}`}>
                              {objective.teamLeadScore.toFixed(1)}/5
                            </span>
                            <span>5 (Excellent)</span>
                          </div>
                        </div>
                        <Textarea
                          value={objective.teamLeadComments}
                          onChange={(e) => handleCommentChange(objective.id, e.target.value)}
                          placeholder="Add your assessment comments..."
                          disabled={!isTeamLead || !canEdit}
                          className="min-h-[80px] text-sm"
                        />
                      </div>
                    </div>

                    {/* Score Comparison */}
                    {objective.employeeScore > 0 && objective.teamLeadScore > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-medium mb-2">Score Analysis</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Employee: {objective.employeeScore.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Team Lead: {objective.teamLeadScore.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Difference: {Math.abs(objective.employeeScore - objective.teamLeadScore).toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span>Weighted: {((Math.max(objective.employeeScore, objective.teamLeadScore) / 5) * objective.marks).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        {canEdit && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {isEmployee && appraisal.status === 'sent_to_employee' && (
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  onClick={() => handleSubmit('submit')}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <Send className="h-4 w-4" />
                  Submit Self-Assessment
                </Button>
              </div>
            )}

            {isTeamLead && appraisal.status === 'employee_completed' && (
              <div className="space-y-4">
                {scoreAlignment.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Score Alignment Check</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      The following objectives have significant score differences. Consider if revision is needed:
                    </p>
                    <div className="space-y-1 text-sm">
                      {scoreAlignment.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>Employee: {item.employeeScore.toFixed(1)} | You: {item.teamLeadScore.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const reason = prompt("Please provide a reason for revision:");
                        if (reason) {
                          setRevisionReason(reason);
                          handleSubmit('revise');
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Request Revision
                    </Button>
                    <Button
                      onClick={() => handleSubmit('approve')}
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve & Send to HR
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completion Status */}
        {appraisal.status === 'completed' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Appraisal Completed</h3>
                  <p className="text-sm text-green-700">
                    Final Score: {appraisal.totalScore.final.toFixed(1)}/100
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppraisalScoring;
