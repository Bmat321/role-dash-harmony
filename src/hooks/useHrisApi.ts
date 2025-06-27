
import { useCallback } from 'react';
import { useSoapAuth } from './useSoapAuth';

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: string;
};

type LeaveRequest = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  reason: string;
};

const useHrisApi = () => {
  const { makeAuthenticatedRequest, hasRole } = useSoapAuth();

  // Employee Management
  const createEmployee = useCallback(async (employeeData: Omit<Employee, 'id'>) => {
    if (!hasRole(['ADMIN'])) {
      throw new Error('Unauthorized');
    }
    const response = await makeAuthenticatedRequest('createEmployee', employeeData);
    return extractEmployeeFromResponse(response);
  }, [makeAuthenticatedRequest, hasRole]);

  const getEmployeeById = useCallback(async (id: string) => {
    const response = await makeAuthenticatedRequest('getEmployeeById', { id });
    return extractEmployeeFromResponse(response);
  }, [makeAuthenticatedRequest]);

  const updateEmployee = useCallback(async (employeeData: Employee) => {
    const response = await makeAuthenticatedRequest('updateEmployee', employeeData);
    return extractEmployeeFromResponse(response);
  }, [makeAuthenticatedRequest]);

  const deleteEmployee = useCallback(async (id: string) => {
    if (!hasRole(['ADMIN'])) {
      throw new Error('Unauthorized');
    }
    const response = await makeAuthenticatedRequest('deleteEmployee', { id });
    return response.getElementsByTagName("success")[0]?.textContent === 'true';
  }, [makeAuthenticatedRequest, hasRole]);

  const listEmployees = useCallback(async () => {
    const response = await makeAuthenticatedRequest('listEmployees');
    return Array.from(response.getElementsByTagName('employee')).map(extractEmployeeFromElement);
  }, [makeAuthenticatedRequest]);

  const searchEmployees = useCallback(async (query: string) => {
    const response = await makeAuthenticatedRequest('searchEmployees', { query });
    return Array.from(response.getElementsByTagName('employee')).map(extractEmployeeFromElement);
  }, [makeAuthenticatedRequest]);

  // Attendance
  const clockIn = useCallback(async () => {
    const response = await makeAuthenticatedRequest('clockIn');
    return {
      timestamp: response.getElementsByTagName("timestamp")[0]?.textContent,
      status: response.getElementsByTagName("status")[0]?.textContent,
    };
  }, [makeAuthenticatedRequest]);

  const clockOut = useCallback(async () => {
    const response = await makeAuthenticatedRequest('clockOut');
    return {
      timestamp: response.getElementsByTagName("timestamp")[0]?.textContent,
      status: response.getElementsByTagName("status")[0]?.textContent,
    };
  }, [makeAuthenticatedRequest]);

  // Leave Management
  const requestLeave = useCallback(async (leaveData: Omit<LeaveRequest, 'id' | 'status'>) => {
    const response = await makeAuthenticatedRequest('requestLeave', leaveData);
    return extractLeaveRequestFromResponse(response);
  }, [makeAuthenticatedRequest]);

  const approveLeave = useCallback(async (leaveId: string, approved: boolean) => {
    if (!hasRole(['ADMIN', 'HR', 'MANAGER'])) {
      throw new Error('Unauthorized');
    }
    const response = await makeAuthenticatedRequest('approveLeave', { 
      leaveId, 
      approved 
    });
    return extractLeaveRequestFromResponse(response);
  }, [makeAuthenticatedRequest, hasRole]);

  // Helper functions
  const extractEmployeeFromResponse = (response: Element): Employee => {
    const employee = response.getElementsByTagName("employee")[0];
    if (!employee) throw new Error('Invalid employee response');
    return extractEmployeeFromElement(employee);
  };

  const extractEmployeeFromElement = (element: Element): Employee => ({
    id: element.getElementsByTagName("id")[0]?.textContent || '',
    name: element.getElementsByTagName("name")[0]?.textContent || '',
    email: element.getElementsByTagName("email")[0]?.textContent || '',
    department: element.getElementsByTagName("department")[0]?.textContent || '',
    position: element.getElementsByTagName("position")[0]?.textContent || '',
    status: element.getElementsByTagName("status")[0]?.textContent || '',
  });

  const extractLeaveRequestFromResponse = (response: Element): LeaveRequest => {
    const leave = response.getElementsByTagName("leaveRequest")[0];
    if (!leave) throw new Error('Invalid leave request response');
    return {
      id: leave.getElementsByTagName("id")[0]?.textContent || '',
      employeeId: leave.getElementsByTagName("employeeId")[0]?.textContent || '',
      startDate: leave.getElementsByTagName("startDate")[0]?.textContent || '',
      endDate: leave.getElementsByTagName("endDate")[0]?.textContent || '',
      type: leave.getElementsByTagName("type")[0]?.textContent || '',
      status: leave.getElementsByTagName("status")[0]?.textContent || '',
      reason: leave.getElementsByTagName("reason")[0]?.textContent || '',
    };
  };

  return {
    // Employee Management
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    listEmployees,
    searchEmployees,
    
    // Attendance
    clockIn,
    clockOut,
    
    // Leave Management
    requestLeave,
    approveLeave,
    
    // Role checking
    hasRole,
  };
};

export default useHrisApi;
