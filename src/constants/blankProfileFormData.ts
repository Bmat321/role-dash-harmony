import { ProfileFormData } from "@/types/user";

export const blankProfileFormData: ProfileFormData = {
  _id: '',
  firstName: '',
  lastName: '',
  middleName: '',
  phoneNumber: '',
  email: '',
  address: '',
  dateOfBirth: '',
  profileImage: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
  skills: [],
  education: '',
  experience: '',
  department: '',
  position: '',
  role: 'employee',
  createdAt: '',
  startDate: '',
  salary: undefined,
  sendInvite: false,
  status: 'active',
  company: '',
  resetRequested: false
};
