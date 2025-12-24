import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/api/api";
import type { LoginCredentials, LoginResponse } from "@/types/auth";

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: loginUser,
  });
};
