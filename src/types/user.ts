/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { User } from "./auth";
import { SerializedError } from "@reduxjs/toolkit";

interface IEmergencyContact {
      name: string,
      relationship: string,
      phone: string,
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  address: string;
  dateOfBirth: string;
  profileImage?: string;
  emergencyContact: IEmergencyContact;
  skills: string;
  education: string;
  experience: string;
  department: string;
  position: string;
  role: string
  createdAt: string;
}

export interface ProfileState {
  isEditing: boolean;
  isLoading: boolean;
  error: string | null;
  formData: ProfileFormData;  // Reference the new formData type here
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    data: User;
  };
}

export interface ProfileContextType {
  profile: ProfileFormData | null;  
  isProfileLoading: boolean;  
   profileError: string | null;  
   uploadIsLoading: boolean; 
  editProfile: (profile: ProfileFormData) => Promise<boolean>;  
  uploadProfile: (formData: FormData) => Promise<boolean>;  
  deleteProfile: (id: string) => Promise<boolean>; 
  // refetchProfile:any; 
}

