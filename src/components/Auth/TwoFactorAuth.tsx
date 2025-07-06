
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TwoFactorAuthProps {
  email?: string;
  onVerificationComplete: () => void;
  onCancel: () => void;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ 
  email, 
  onVerificationComplete, 
  onCancel 
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call for verification
    setTimeout(() => {
      if (verificationCode === '123456') { // Mock verification
        setIsSuccess(true);
        toast({
          title: "Verification Successful",
          description: "You have been successfully verified",
        });
        setTimeout(() => {
          onVerificationComplete();
        }, 1500);
      } else {
        setError('Invalid verification code. Please try again.');
        setIsLoading(false);
      }
    }, 2000);
  };

  const handleResendCode = async () => {
    toast({
      title: "Verification Code Sent",
      description: "A new verification code has been sent to your email",
    });
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verification Successful!</h2>
            <p className="text-gray-600">You will be redirected to your dashboard shortly.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
          <CardDescription>
            We've sent a verification code to your email address
            {email && <span className="block mt-1 font-medium">{email}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email || ''}
                placeholder="your@email.com"
                className="pl-10"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={handleVerify}
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>

            <div className="flex justify-between items-center text-sm">
              <Button 
                variant="link" 
                onClick={handleResendCode}
                className="p-0 h-auto text-blue-600"
              >
                Resend Code
              </Button>
              <Button 
                variant="link" 
                onClick={onCancel}
                className="p-0 h-auto text-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuth;
