
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface AppraisalScoringProps {
  appraisalId: string;
  title: string;
  employeeName: string;
  criteria: AppraisalCriteria[];
  isManager: boolean;
  status: 'employee_pending' | 'manager_pending' | 'hr_review' | 'completed';
  onBack: () => void;
  onSubmit: (updatedCriteria: AppraisalCriteria[], totalScore: number) => void;
}

const AppraisalScoring: React.FC<AppraisalScoringProps> = ({
  appraisalId,
  title,
  employeeName,
  criteria: initialCriteria,
  isManager,
  status,
  onBack,
  onSubmit
}) => {
  const [criteria, setCriteria] = useState<AppraisalCriteria[]>(initialCriteria);
  const [comments, setComments] = useState('');

  const handleScoreChange = (criteriaId: string, score: number) => {
    setCriteria(prev => prev.map(criterion => {
      if (criterion.id === criteriaId) {
        if (isManager) {
          return { ...criterion, managerScore: score };
        } else {
          return { ...criterion, employeeScore: score };
        }
      }
      return criterion;
    }));
  };

  const handleCommentChange = (criteriaId: string, comment: string) => {
    setCriteria(prev => prev.map(criterion => {
      if (criterion.id === criteriaId) {
        return { ...criterion, comments: comment };
      }
      return criterion;
    }));
  };

  const calculateTotalScore = () => {
    return criteria.reduce((total, criterion) => {
      const score = isManager ? criterion.managerScore : criterion.employeeScore;
      return total + (score * criterion.weight / 100);
    }, 0);
  };

  const handleSubmit = () => {
    const totalScore = calculateTotalScore();
    const updatedCriteria = criteria.map(criterion => ({
      ...criterion,
      finalScore: isManager ? criterion.managerScore : criterion.employeeScore
    }));

    onSubmit(updatedCriteria, totalScore);
    
    toast({
      title: "Appraisal Submitted",
      description: `Your appraisal scores have been submitted successfully.`,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 4) return 'bg-green-500';
    if (score >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const canEdit = (status === 'employee_pending' && !isManager) || 
                 (status === 'manager_pending' && isManager);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-600">Employee: {employeeName}</p>
        </div>
        <div className="ml-auto">
          <Badge variant={status === 'completed' ? 'default' : 'outline'}>
            {status === 'employee_pending' && 'Awaiting Employee'}
            {status === 'manager_pending' && 'Awaiting Manager'}
            {status === 'hr_review' && 'HR Review'}
            {status === 'completed' && 'Completed'}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Score</CardTitle>
          <CardDescription>
            Current total score: {calculateTotalScore().toFixed(1)}/100
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress 
              value={calculateTotalScore()} 
              className="h-3"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0</span>
              <span className={`font-bold ${getScoreColor(calculateTotalScore() / 20)}`}>
                {calculateTotalScore().toFixed(1)}
              </span>
              <span>100</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {criteria.map((criterion, index) => (
          <Card key={criterion.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{criterion.name}</CardTitle>
                  <CardDescription>{criterion.description}</CardDescription>
                </div>
                <Badge variant="outline">{criterion.weight}%</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Score */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Employee Score</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[criterion.employeeScore]}
                      onValueChange={([value]) => !isManager && canEdit && handleScoreChange(criterion.id, value)}
                      max={5}
                      min={0}
                      step={0.1}
                      disabled={isManager || !canEdit}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span className={`font-bold ${getScoreColor(criterion.employeeScore)}`}>
                        {criterion.employeeScore.toFixed(1)}
                      </span>
                      <span>5</span>
                    </div>
                  </div>
                </div>

                {/* Manager Score */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Manager Score</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[criterion.managerScore]}
                      onValueChange={([value]) => isManager && canEdit && handleScoreChange(criterion.id, value)}
                      max={5}
                      min={0}
                      step={0.1}
                      disabled={!isManager || !canEdit}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span className={`font-bold ${getScoreColor(criterion.managerScore)}`}>
                        {criterion.managerScore.toFixed(1)}
                      </span>
                      <span>5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Comments</Label>
                <Textarea
                  value={criterion.comments}
                  onChange={(e) => canEdit && handleCommentChange(criterion.id, e.target.value)}
                  placeholder="Add comments for this criterion..."
                  disabled={!canEdit}
                  className="min-h-[80px]"
                />
              </div>

              {/* Score Comparison */}
              {criterion.employeeScore > 0 && criterion.managerScore > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2">Score Comparison</div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Employee: {criterion.employeeScore.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Manager: {criterion.managerScore.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Difference: {Math.abs(criterion.employeeScore - criterion.managerScore).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Comments</CardTitle>
          <CardDescription>
            Add any additional feedback or comments for this appraisal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your overall comments..."
            disabled={!canEdit}
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Submit {isManager ? 'Manager' : 'Employee'} Scores
          </Button>
        </div>
      )}

      {status === 'completed' && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Appraisal Completed</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              This appraisal has been completed and finalized.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppraisalScoring;
