import { getTokens } from '@/utils/cookieUtils';
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';



const baseQuery = fetchBaseQuery({
  baseUrl:  import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    const excludedRoutes = [
      '/register',
      '/activate-user',
      '/login',
      '/request-user-password',
      '/reset-user-password',
    ];

    if (!excludedRoutes.some(route => endpoint.includes(route))) {
      const { token, refreshToken } = getTokens();
      if (token || refreshToken) {
        headers.set('Authorization', `Bearer ${token || refreshToken}`);
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
  // First, call the base query
  const result = await baseQuery(args, api, extraOptions);

  // If unauthorized, try to refresh token
  if (result.error?.status === 401) {
    const { refreshToken } = getTokens(); // assume synchronous here

    // if (refreshToken) {
    //   try {
    //     const refreshResponse = await fetch(
    //       `${process.env.ENDPOINT}/api/auth/refresh`,
    //       {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //           Authorization: `Bearer ${refreshToken}`,
    //         },
    //         credentials: 'include',
    //       },
    //     );

    //     if (!refreshResponse.ok) {
    //       if (process.env.NODE_ENV !== 'production') {
    //         console.log('Failed to refresh token');
    //       }
    //     //   api.dispatch(userLogout());
    //       return result;
    //     }

    //     const refreshData: RefreshTokenResponse = await refreshResponse.json();

    //     if (
    //       refreshData.success &&
    //       refreshData.access_token &&
    //       refreshData.refresh_token
    //     ) {
    //       await setTokenAndRefresh(
    //         refreshData.access_token,
    //         refreshData.refresh_token,
    //         null,
    //         '',
    //         null,
    //         null,
    //       );

    //       api.dispatch(
    //         userLoggedIn({
    //           accessToken: refreshData.access_token,
    //           refreshToken: refreshData.refresh_token,
    //           user: refreshData.user,
    //           kycStatus: refreshData.kycStatus,
    //         }),
    //       );

    //       // Retry original query with new token
    //       return await baseQuery(args, api, extraOptions);
    //     } else {
    //       api.dispatch(userLogout());
    //     }
    //   } catch (error) {
    //     api.dispatch(userLogout());
    //   }
    // }
  }

  // If no 401 error or refresh failed, return original result
  return result;
};


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    loadUser: builder.query({
      query: () => ({
        url: '/api/auth/me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        // try {
        //   const result = await queryFulfilled;
        //   dispatch(
        //     userLoggedIn({
        //       accessToken: result.data.accessToken,
        //       refreshToken: result.data.refreshToken,
        //       user: result.data.user,
        //       kycStatus: result.data.kycStatus,
        //       humanVerified: result.data.humanVerified,
        //       twoGoogleAuth: result.data.twoGoogleAuth,
        //       transactions: result.data.transactions.map(
        //         (transaction: any) => ({
        //           ...transaction,
        //           createdAt: new Date(transaction.createdAt).toISOString(),
        //           updatedAt: new Date(transaction.updatedAt).toISOString(),
        //         }),
        //       ),
        //     }),
        //   );
        // } catch (error) {
        //   if (NODE_ENV !== 'production') {
        //     log.info('LOAD USER ERROR', error);
        //   }
        // }
      },
    }),
  }),
});

export const {useLoadUserQuery} = apiSlice;
