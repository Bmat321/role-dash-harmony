
import { toast } from '@/hooks/use-toast';
import { getTokens } from '@/utils/cookieUtils';
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
const ENDPOINT = import.meta.env.VITE_API_BASE_URL;
const NODE_ENV = import.meta.env.VITE_NODE_ENV;


console.log("ENDPOINT", ENDPOINT)

const baseQuery = fetchBaseQuery({ 
  baseUrl: ENDPOINT,
  prepareHeaders: async (headers, {getState, endpoint}) => {
    const excludedRoutes = [
      '/register',
      '/activate-user',
      '/login',
      '/request-user-password',
      '/reset-user-password',
    ];

    const currentUrl = endpoint;

    if (!excludedRoutes.some(route => currentUrl.includes(route))) {
      const {token, refreshToken} = getTokens();

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 429) {
        toast({
        title: "Too many requests. Please try again later!",
      });
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

// export const {useLoadUserQuery} = apiSlice;
