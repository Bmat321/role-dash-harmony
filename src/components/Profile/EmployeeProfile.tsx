
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  Edit,
  Save,
  X
} from 'lucide-react';
import ProfilePictureUpload from './ProfilePictureUpload';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFormData, setIsEditing } from '@/store/slices/profile/profileSlice';
import { useCombinedContext } from '@/contexts/AuthContext';

const EmployeeProfile: React.FC = () => {
const { profile } = useCombinedContext();
    const user = profile.profile
    const dispatch = useAppDispatch()  
  const {formData, isEditing } = useAppSelector((state) => state.profile);  
  
  // const [isEditing, setIsEditing] = useState(false);
  // const [formData, setFormData] = useState({
  //   firstName: user?.firstName || '',
  //   lastName: user?.lastName || '',
  //   email: user?.email || '',
  //   phone: '',
  //   address: '',
  //   dateOfBirth: '',
  //   emergencyContact: '',
  //   skills: '',
  //   education: '',
  //   experience: ''
  // });

  const handleSave = () => {
    // Save profile logic here
    dispatch(setIsEditing(false));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : dispatch(setIsEditing(true))}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <ProfilePictureUpload 
            userName={`${user?.firstName} ${user?.lastName}`}
            hasUploadedBefore={false}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h3>
                <Badge variant="outline" className="mt-2">
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span>{user?.department || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined: January 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => dispatch(setFormData({ ...formData, firstName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => dispatch(setFormData({ ...formData, lastName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => dispatch(setFormData({ ...formData, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phoneNumber}
                        onChange={(e) => dispatch(setFormData({ ...formData, phone: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => dispatch(setFormData({ ...formData, dateOfBirth: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => dispatch(setFormData({ ...formData, address: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter your full address"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Your work-related details and qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="skills">Skills & Competencies</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => dispatch(setFormData({ ...formData, skills: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="List your key skills and competencies"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => dispatch(setFormData({ ...formData, education: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Your educational background"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="experience">Work Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => dispatch(setFormData({ ...formData, experience: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Previous work experience"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>Contact information for emergencies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact Details</Label>
                    <Textarea
                      id="emergencyContact"
                      value={formData.emergencyContact.name}
                      onChange={(e) => dispatch(setFormData({ ...formData, emergencyContact: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Name, relationship, phone number, and address of emergency contact"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
