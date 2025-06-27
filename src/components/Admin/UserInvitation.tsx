
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, UserPlus, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PendingInvitation {
  id: string;
  email: string;
  role: 'hr' | 'manager' | 'employee';
  status: 'pending' | 'sent' | 'accepted';
  invitedAt: string;
  invitedBy: string;
}

const UserInvitation: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'hr' | 'manager' | 'employee'>('employee');
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([
    {
      id: '1',
      email: 'john.doe@company.com',
      role: 'employee',
      status: 'pending',
      invitedAt: '2024-01-15',
      invitedBy: 'Admin User'
    },
    {
      id: '2',
      email: 'jane.smith@company.com',
      role: 'hr',
      status: 'sent',
      invitedAt: '2024-01-14',
      invitedBy: 'Admin User'
    }
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendInvitation = () => {
    if (!email || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newInvitation: PendingInvitation = {
      id: Date.now().toString(),
      email,
      role,
      status: 'sent',
      invitedAt: new Date().toISOString().split('T')[0],
      invitedBy: 'Admin User'
    };

    setPendingInvitations(prev => [newInvitation, ...prev]);
    setEmail('');
    setRole('employee');

    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${email}`,
    });
  };

  const copyInviteLink = (invitationId: string, email: string) => {
    const inviteLink = `${window.location.origin}/set-password?token=${invitationId}&email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedId(invitationId);
    setTimeout(() => setCopiedId(null), 2000);
    
    toast({
      title: "Link Copied",
      description: "Invitation link copied to clipboard",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New User
          </CardTitle>
          <CardDescription>Send invitation links to new employees, HR staff, or managers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: 'hr' | 'manager' | 'employee') => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSendInvitation} className="w-full md:w-auto">
            <Mail className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Manage sent invitations and track their status</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInvitations.length > 0 ? (
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium truncate">{invitation.email}</p>
                      <Badge className={getStatusColor(invitation.status)}>
                        {invitation.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {invitation.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Invited on {new Date(invitation.invitedAt).toLocaleDateString()} by {invitation.invitedBy}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyInviteLink(invitation.id, invitation.email)}
                    disabled={invitation.status === 'accepted'}
                  >
                    {copiedId === invitation.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No pending invitations</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInvitation;
