import { Shield, Users, Briefcase, User } from "lucide-react";

  // Helper function to get editable fields based on role
  export function getEditableFields(role: string | undefined) {
    switch (role?.toLowerCase()) {
      case 'manager':
      case 'employee':
        return ['phoneNumber', 'address', 'skills', 'experience', 'emergencyContact']; // Manager can edit specific fields
      case 'admin':
      case 'hr':
        return ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'skills', 'emergencyContact', 'department', 'position', 'education', 'experience']; // Admin/HR can edit all fields
      default:
        return []; // No fields editable by default
    }
  }

    export const getRoleIcon = (role: string) => {
      switch (role) {
        case 'admin':
          return Shield;
        case 'hr':
          return Users;
        case 'manager':
        case 'team_lead':
          return Briefcase;
        default:
          return User;
      }
    };
  
    export const getRoleColor = (role: string) => {
      switch (role) {
        case 'admin':
          return 'text-red-700 bg-red-100 border-red-300';
        case 'hr':
          return 'text-blue-700 bg-blue-100 border-blue-300';
        case 'manager':
          return 'text-green-700 bg-green-100 border-green-300';
        case 'team_lead':
          return 'text-purple-700 bg-purple-100 border-purple-300';
        default:
          return 'text-gray-700 bg-gray-100 border-gray-300';
      }
    };
  