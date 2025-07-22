
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {useCombinedContext } from '@/contexts/AuthContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  Edit,
  Save,
  X,
  Shield,
  Users,
  Settings,
  Loader2
} from 'lucide-react';
import ProfilePictureUpload from './ProfilePictureUpload';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { setFormData, setIsEditing, setLoading } from '@/store/slices/profile/profileSlice';
import { formatDateTime } from '@/utils/date';
import { getEditableFields, getRoleColor, getRoleIcon } from '@/utils/getEditableFields';
import { useReduxProfile } from '@/hooks/user/useReduxProfile';
import { ProfileResponse, ProfileState } from '@/types/user';
import { toast } from '@/hooks/use-toast';

const UserProfile: React.FC = () => {
    const {user: userUserProfile , profile: userProfile } = useCombinedContext();

    const {profile:user,  isProfileLoading } = userProfile
  const {editProfile} = useReduxProfile()
  const dispatch = useAppDispatch()
  const {formData, isEditing, isLoading, bulkEmployees } = useAppSelector((state) => state.profile);  

 
  const editableFields = getEditableFields(user?.role);


const handleSave = async () => {
  dispatch(setIsEditing(false))
  await editProfile(formData) as unknown as ProfileResponse;

};

   const handleEdit = () => {
    dispatch(setIsEditing(!isEditing)); // Enable editing
  };


  const RoleIcon = getRoleIcon(user?.role || '');
  const canEditAll = user?.role === 'admin' || user?.role === 'hr';
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : handleEdit()}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Save Changes
                {isProfileLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
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
                <RoleIcon className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h3>
                <Badge className={`mt-2 ${getRoleColor(user?.role || '')}`}>
                  {user?.role?.toUpperCase().replace('_', ' ')}
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
                  <span>Joined: {formatDateTime(user.createdAt)} </span>
                </div>
                {(user?.role === 'admin' || user?.role === 'hr') && (
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>{user?.position}</span>
                  </div>
                )}
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
                         disabled={!(isEditing && editableFields.includes('firstName'))}

                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData?.lastName}
                        onChange={(e) => dispatch(setFormData({ ...formData, lastName: e.target.value }))}
                                                disabled={!(isEditing && editableFields.includes('lastName'))}

                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData?.email}
                      onChange={(e) => dispatch(setFormData({ ...formData, email: e.target.value }))}
                                            disabled={!(isEditing && editableFields.includes('email'))}

                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData?.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!(isEditing && editableFields.includes('phone'))}                                      

                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData?.dateOfBirth}
                        onChange={(e) => dispatch(setFormData({ ...formData, dateOfBirth: e.target.value }))}
                        disabled={!(isEditing && editableFields.includes('dateOfBirth'))}


                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData?.address}
                      onChange={(e) => dispatch(setFormData({ ...formData, address: e.target.value }))}
                       disabled={!(isEditing && editableFields.includes('address'))}


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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData?.department}
                        onChange={(e) => dispatch(setFormData({ ...formData, department: e.target.value }))}
                                                                                          disabled={!(isEditing && editableFields.includes('department'))}


                        placeholder="Your department"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData?.position}
                        onChange={(e) => dispatch(setFormData({ ...formData, position: e.target.value }))}
                                                                                          disabled={!(isEditing && editableFields.includes('position'))}


                        placeholder="Your job position"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formatDateTime(formData?.createdAt)}
                      onChange={(e) => dispatch(setFormData({ ...formData, startDate: e.target.value }))}
                                                                                       disabled={!(isEditing && editableFields.includes('startDate'))}


                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="skills">Skills & Competencies</Label>
                    <Textarea
                      id="skills"
                      value={formData?.skills}
                      onChange={(e) => dispatch(setFormData({ ...formData, skills: e.target.value }))}
                                                                                       disabled={!(isEditing && editableFields.includes('skills'))}


                      placeholder="List your key skills and competencies"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={formData?.education}
                      onChange={(e) => dispatch(setFormData({ ...formData, education: e.target.value }))}
                                                                                       disabled={!(isEditing && editableFields.includes('education'))}


                      placeholder="Your educational background"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="experience">Work Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData?.experience}
                      onChange={(e) => dispatch(setFormData({ ...formData, experience: e.target.value }))}
                                                                                       disabled={!(isEditing && editableFields.includes('experience'))}


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
                      value={formData?.emergencyContact?.name}
                      onChange={(e) => dispatch(setFormData({ ...formData, emergencyContact: e.target.value }))}
                    disabled={!(isEditing && editableFields.includes('emergencyContact'))}


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

export default UserProfile;
