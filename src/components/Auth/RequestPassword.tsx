
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RequestPasswordProps {
  onBack?: () => void;
}

const RequestPassword: React.FC<RequestPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleRequestPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast({
        title: "Password Request Sent",
        description: "Check your email for password reset instructions",
      });
    }, 2000);
  };

  if (isSuccess) {
    return (
      <Card className="w-full border-0 shadow-none">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute right-0 top-0 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-0 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
          <p className="text-gray-600 mb-6">
            We've sent password reset instructions to your email address. 
            Please check your inbox and follow the instructions.
          </p>
          <Button className="w-full" onClick={onBack}>
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="relative text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="absolute right-0 top-0 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you instructions to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleRequestPassword}
          disabled={isLoading}
        >
          {isLoading ? "Sending Request..." : "Send Reset Instructions"}
        </Button>

        {onBack && (
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestPassword;
