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
  _id:string,
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber?: string;
  email: string;
  address: string;
  dateOfBirth: string;
  profileImage?: string;
  emergencyContact: IEmergencyContact;
  skills: string[];
  education: string;
  experience?: string;
  department?: string;
  position: string;
    role:  
  | 'md'
  | 'teamlead'
  | 'employee'
  | 'admin'
  | 'hr';
  createdAt: string;
  startDate: string;
  salary?: number;
  sendInvite: boolean;
  status: 'active' | 'inactive' | 'terminated';
  company: string,
  resetRequested: boolean
}

export interface ProfileState {
  isEditing: boolean;
  isLoading: boolean;
  error: string | null;
   bulkEmployees: Partial<ProfileFormData>[];
  formData: ProfileFormData;  
  isBulkImportOpen: boolean;
  isDialogOpen:boolean;
  selectedEmployee: ProfileFormData | null;
  showDetailView: boolean;
  searchTerm: string;
  filterDepartment: string;
  isProcessingBulk: boolean;
  isEditMode: boolean
  selectedDeleteId: string
  isDeleteDialogOpen: boolean
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
}

