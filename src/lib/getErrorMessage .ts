interface ErrorResponse {
  data?: {
    message?: string;
  };
  status?: number;
}

export const getErrorMessage = (error: ErrorResponse): string => {
  if (error?.data?.message) {
    return error.data.message; // Extract message from the error
  } else if (error?.status) {
    return `Error: ${error.status}`; // Return status code as string if no message
  }
  return "An unknown error occurred."; // Fallback for any unhandled error structure
};