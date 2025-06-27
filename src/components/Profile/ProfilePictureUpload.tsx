
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureUploadProps {
  currentAvatar?: string;
  userName: string;
  hasUploadedBefore?: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  currentAvatar, 
  userName, 
  hasUploadedBefore = false 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (hasUploadedBefore) {
      toast({
        title: "Upload Limit Reached",
        description: "You can only upload your profile picture once. Please contact HR if you need to change it.",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!previewUrl || hasUploadedBefore) return;

    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully",
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Profile Picture
        </CardTitle>
        <CardDescription>
          Upload a professional photo for your profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={previewUrl || undefined} alt={userName} />
            <AvatarFallback className="text-2xl bg-primary-100 text-primary-700">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>

          {hasUploadedBefore ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have already uploaded your profile picture. Contact HR if you need to make changes.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="profile-picture-upload"
              />
              <label htmlFor="profile-picture-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Photo
                  </span>
                </Button>
              </label>

              {previewUrl && (
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full max-w-xs"
                >
                  {isUploading ? "Uploading..." : "Save Profile Picture"}
                </Button>
              )}

              <p className="text-xs text-gray-500 text-center">
                Recommended: Square image, at least 200x200px<br />
                Maximum file size: 5MB<br />
                <strong>Note: You can only upload once</strong>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;
