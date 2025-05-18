import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ErrorResponse {
  message: string;
}

interface SuccessResponse {
  message: string;
}

class ReduxUtils {
  static extractErrMsg(error: unknown): string {
    if (!error) return "Unknown error occurred";

    const errorData = error as FetchBaseQueryError;

    return "data" in errorData
      ? (errorData.data as ErrorResponse)?.message || "An error occurred"
      : errorData.error || "An error occurred";
  }

  static extractSuccessMsg(data: unknown): string {
    if (!data) return "Unknown success message";

    const successData = data as SuccessResponse;
    return successData.message || "Success";
  }
}

export default ReduxUtils;
