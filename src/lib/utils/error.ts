import { AxiosError } from "axios";

interface BackendErrorResponse {
  message?: string;
  errors?: Array<{ msg: string; param?: string }>;
}

export const extractErrorMessage = (
  error: unknown,
  fallbackMessage: string = "An error occured",
): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as BackendErrorResponse | undefined;

    if (data?.errors?.length) {
      return data.errors.map((err) => err.msg).join(", ");
    }

    if (data?.message) {
      return data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};
