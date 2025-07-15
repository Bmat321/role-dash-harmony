// features/profile/profileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileFormData, ProfileState } from '@/types/user';
import { profileApi } from './profileApi';



const initialState: ProfileState = {
  isEditing: false,
  isLoading: false,
  error: null,
  formData: {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    dateOfBirth: '',
    phoneNumber: '',
    profileImage:'',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    skills: '',
    education: '',
    experience: '',
    department: '',
    position: '',
    role:'',
    createdAt: '',
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setIsEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
    setFormData(state, action: PayloadAction<Partial<ProfileFormData>>) {
      console.log("action", action.payload)

      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData(state, action: PayloadAction<ProfileFormData>) {
      state.formData = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get Profile matchers
    builder
      .addMatcher(profileApi.endpoints.getProfile.matchPending, (state) => { 
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(profileApi.endpoints.getProfile.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.formData = action.payload.data; 
      })
      .addMatcher(profileApi.endpoints.getProfile.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to load profile';
      });

    // Edit Profile matchers
    builder
      .addMatcher(profileApi.endpoints.editProfile.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(profileApi.endpoints.editProfile.matchFulfilled, (state, action) => {
        state.isLoading = false;    
        state.formData = { ...state.formData, ...action.payload.data }; 
      })
      .addMatcher(profileApi.endpoints.editProfile.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to update profile';
      });

    // Upload Profile matchers (for profile picture upload)
    builder
      .addMatcher(profileApi.endpoints.uploadProfile.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(profileApi.endpoints.uploadProfile.matchFulfilled, (state, action) => {
        state.isLoading = false;
        // Assuming action.payload contains the new profile image URL or object
        state.formData.profileImage = action.payload.data.profileImage;
      })
      .addMatcher(profileApi.endpoints.uploadProfile.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to upload profile image';
      });
  },
});

export const { setIsEditing, setFormData, resetFormData, setLoading, setError } = profileSlice.actions;
export default profileSlice.reducer;
