
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  avatar?: string;
  status: string;
  role: string;
  token: string;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

const useSoapAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });


 
  const makeSoapRequest = useCallback(async (
    method: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: Record<string, any> = {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers: Record<string, any> = {}
  ) => {
    const bodyEntries = Object.entries(body)
      .map(([key, value]) => `<${key}>${escapeXml(String(value))}</${key}>`)
      .join('');

    const headerEntries = Object.entries(headers)
      .map(([key, value]) => `<${key}>${escapeXml(String(value))}</${key}>`)
      .join('');

    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:hr="http://example.com/hris">
        ${headerEntries ? `<soapenv:Header>${headerEntries}</soapenv:Header>` : '<soapenv:Header/>'}
        <soapenv:Body>
          <hr:${method}>
            ${bodyEntries}
          </hr:${method}>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hris`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': method,
        'X-SOAP-Request': 'true' 
      },
      
      body: soapRequest,
      credentials: 'include',
      mode: 'cors' // Explicitly set CORS mode
    });

    if (!response.ok) {
      throw new Error(`SOAP request failed with status ${response.status}`);
    }

    return response.text();
  }, []);

  const parseSoapResponse = useCallback((xmlText: string, method: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    const fault = xmlDoc.getElementsByTagName("faultstring")[0];
    if (fault) {
      throw new Error(fault.textContent || `SOAP ${method} failed`);
    }
    
    return xmlDoc.getElementsByTagName(`${method}Response`)[0];
  }, []);

 

  // Public Auth Methods
  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const xmlText = await makeSoapRequest('loginUser', { email, password });
      const response = parseSoapResponse(xmlText, 'loginUser');
      const user = extractUserFromResponse(response);
      
      localStorage.setItem('hris_mock_token', user.token);
      localStorage.setItem('hris_mock_user', JSON.stringify(user));

      setAuthState({
        user,
        isLoading: false,
        error: null,
      });

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName}!`,
      });

      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [makeSoapRequest, parseSoapResponse]);

  const register = useCallback(async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const xmlText = await makeSoapRequest('registerUser', userData);
      const response = parseSoapResponse(xmlText, 'registerUser');
      
      toast({
        title: "Registration successful",
        description: "You can now login with your credentials",
      });
      
      return response.getElementsByTagName("success")[0]?.textContent === 'true';
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }, [makeSoapRequest, parseSoapResponse]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const xmlText = await makeSoapRequest('resetPassword', { email });
      const response = parseSoapResponse(xmlText, 'resetPassword');
      
      toast({
        title: "Password reset initiated",
        description: "Check your email for further instructions",
      });
      
      return response.getElementsByTagName("success")[0]?.textContent === 'true';
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Password reset failed');
    }
  }, [makeSoapRequest, parseSoapResponse]);

  // Protected Methods
  const validateToken = useCallback(async (token: string) => {
    try {
      const xmlText = await makeSoapRequest('validateToken', {}, { token });
      const response = parseSoapResponse(xmlText, 'validateToken');
      return response.getElementsByTagName("isValid")[0]?.textContent === 'true';
    } catch (error) {
      throw new Error('Token validation failed');
    }
  }, [makeSoapRequest, parseSoapResponse]);

  const logout = useCallback(() => {
    localStorage.removeItem('hris_mock_token');
    localStorage.removeItem('hris_mock_user');
    setAuthState({
      user: null,
      isLoading: false,
      error: null,
    });
    toast({
      title: "Logged out successfully",
    });

  }, []);

  const hasRole = useCallback((requiredRoles: string[]) => {
    if (!authState.user) return false;
    return requiredRoles.some(role => authState.user?.role.includes(role));
  }, [authState.user]);

  // Helper function to extract user data from response
  const extractUserFromResponse = (response: Element): User => {
    const userId = response.getElementsByTagName("id")[0]?.textContent;
    const firstName = response.getElementsByTagName("firstName")[0]?.textContent;
    const lastName = response.getElementsByTagName("lastName")[0]?.textContent;
    const email = response.getElementsByTagName("email")[0]?.textContent;
    const token = response.getElementsByTagName("token")[0]?.textContent;
    const department = response.getElementsByTagName("department")[0]?.textContent;
    const status = response.getElementsByTagName("status")[0]?.textContent;
    const avatar = response.getElementsByTagName("avatar")[0]?.textContent;
    const role = response.getElementsByTagName("role")[0]?.textContent;

    
    if (!userId || !firstName || !email || !token) {
      throw new Error('Invalid user data in response');
    }

    return { id: userId,department, status, avatar, firstName, lastName, email, role, token };
  };

  return {
    ...authState,
    login,
    register,
    resetPassword,
    logout,
    hasRole,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    makeAuthenticatedRequest: async (method: string, body: Record<string, any> = {}) => {
      if (!authState.user) {
        throw new Error('Not authenticated');
      }
      const xmlText = await makeSoapRequest(method, body, { token: authState.user.token });
      return parseSoapResponse(xmlText, method);
    },
  };
};

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export default useSoapAuth;