
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '@/types/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/hris`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'text/xml; charset=utf-8');
      headers.set('X-Requested-With', 'XMLHttpRequest');
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ email, password }) => {
        const soapRequest = createSoapRequest('loginUser', { email, password });
        return {
          url: '',
          method: 'POST',
          body: soapRequest,
          headers: { 'SOAPAction': '"loginUser"' },
        };
      },
      transformResponse: (response: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "text/xml");
        const userElement = xmlDoc.getElementsByTagName('loginUserResponse')[0];
        return extractUserFromResponse(userElement);
      },
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<boolean, RegisterRequest>({
      query: (userData) => {
        const soapRequest = createSoapRequest('registerUser', userData);
        return {
          url: '',
          method: 'POST',
          body: soapRequest,
          headers: { 'SOAPAction': '"registerUser"' },
        };
      },
      transformResponse: (response: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "text/xml");
        return xmlDoc.getElementsByTagName("success")[0]?.textContent === 'true';
      },
    }),
    resetPassword: builder.mutation<boolean, ResetPasswordRequest>({
      query: ({ email }) => {
        const soapRequest = createSoapRequest('resetPassword', { email });
        return {
          url: '',
          method: 'POST',
          body: soapRequest,
          headers: { 'SOAPAction': '"resetPassword"' },
        };
      },
      transformResponse: (response: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "text/xml");
        return xmlDoc.getElementsByTagName("success")[0]?.textContent === 'true';
      },
    }),
    validateToken: builder.query<boolean, string>({
      query: (token) => {
        const soapRequest = createSoapRequest('validateToken', {}, { token });
        return {
          url: '',
          method: 'POST',
          body: soapRequest,
          headers: { 'SOAPAction': '"validateToken"' },
        };
      },
      transformResponse: (response: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "text/xml");
        return xmlDoc.getElementsByTagName("isValid")[0]?.textContent === 'true';
      },
      providesTags: ['User'],
    }),
  }),
});

// Helper functions
function createSoapRequest(
  method: string,
  body: Record<string, any> = {},
  headers: Record<string, any> = {}
) {
  const bodyEntries = Object.entries(body)
    .map(([key, value]) => `<${key}>${escapeXml(String(value))}</${key}>`)
    .join('');

  const headerEntries = Object.entries(headers)
    .map(([key, value]) => `<${key}>${escapeXml(String(value))}</${key}>`)
    .join('');

  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:hr="http://example.com/hris">
      ${headerEntries ? `<soapenv:Header>${headerEntries}</soapenv:Header>` : '<soapenv:Header/>'}
      <soapenv:Body>
        <hr:${method}>
          ${bodyEntries}
        </hr:${method}>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
}

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

function extractUserFromResponse(response: Element): LoginResponse {
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

  const user: User = {
    id: userId,
    firstName,
    lastName: lastName || '',
    email,
    role: role as any || 'employee',
    department: department || '',
    status: status as any || 'active',
    avatar,
    token
  };

  return { user, token };
}

export const {
  useLoginMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useValidateTokenQuery,
} = authApi;
