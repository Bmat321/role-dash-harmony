
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield, Building2, Users, BarChart, Clock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@hris.com', password: 'Admin@123', color: 'bg-red-500' },
    { role: 'HR', email: 'hr@hris.com', password: 'hr123', color: 'bg-blue-500' },
    { role: 'Manager', email: 'manager@hris.com', password: 'manager123', color: 'bg-green-500' },
    { role: 'Employee', email: 'employee@hris.com', password: 'emp123', color: 'bg-gray-500' },
  ];

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  // HRIS SVG Component
  const HRISSvg = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="20" fill="url(#gradient)" />
      <path d="M30 30h20v60h-20V30zm0 25h20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <path d="M70 30c11 0 20 9 20 20v40h-15V50c0-2.76-2.24-5-5-5s-5 2.24-5 5v40H50V50c0-11 9-20 20-20z" fill="white"/>
      <circle cx="70" cy="45" r="8" fill="#ffffff" opacity="0.9"/>
      <rect x="25" y="85" width="70" height="3" rx="1.5" fill="white" opacity="0.7"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600 text-lg">Sign in to your HRIS Dashboard</p>
            </div>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-12"
                    autoComplete='email'
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12"
                    autoComplete='current-password'
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">Demo Accounts</CardTitle>
              <CardDescription className="text-center">Click to use demo credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.role}
                    variant="outline"
                    onClick={() => fillDemoCredentials(account.email, account.password)}
                    className="h-12 justify-start font-medium hover:bg-gray-50"
                  >
                    <div className={`w-3 h-3 rounded-full ${account.color} mr-3`} />
                    {account.role}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Company Branding with HRIS SVG */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-sm">
                <HRISSvg />
              </div>
            </div>
            <h2 className="text-5xl font-bold">HRIS</h2>
            <p className="text-xl opacity-90">Human Resource Information System</p>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Users className="h-8 w-8" />
                <div className="text-left">
                  <h3 className="font-semibold">Employee Management</h3>
                  <p className="text-sm opacity-80">Comprehensive workforce management</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <BarChart className="h-8 w-8" />
                <div className="text-left">
                  <h3 className="font-semibold">Analytics & Reports</h3>
                  <p className="text-sm opacity-80">Data-driven insights and reporting</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Clock className="h-8 w-8" />
                <div className="text-left">
                  <h3 className="font-semibold">Time Tracking</h3>
                  <p className="text-sm opacity-80">Efficient attendance management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default Login;
