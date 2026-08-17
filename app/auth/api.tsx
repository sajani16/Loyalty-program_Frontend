import { useMutation } from "@tanstack/react-query";
import { signIn, SignInResponse } from "next-auth/react";
import { authService, RegisterData, LoginData } from "@/services/auth.service";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authService.verifyOtp(email, otp),
  });
};

export interface LoginCredentials extends LoginData {
  userType?: string;
}

export const useLoginMutation = () => {
  return useMutation<SignInResponse | undefined, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        userType: credentials.userType || "customer",
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      return res;
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: ({
      email,
      token,
      newPassword,
    }: {
      email: string;
      token: string;
      newPassword: string;
    }) => authService.resetPassword(email, token, newPassword),
  });
};
