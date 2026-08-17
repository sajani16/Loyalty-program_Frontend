"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Lock, CheckCircle, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/validations/auth.validation";
import { useResetPasswordMutation } from "../api"; // Adjust path as needed

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const emailFromQuery = searchParams.get("email") || "";
  const email =
    emailFromQuery ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("verifyEmail") || ""
      : "");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPasswordMutation();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetPasswordSchema) => {
    if (!token || !email) {
      toast.error(
        "Invalid or missing reset details. Please request a new reset link.",
      );
      return;
    }

    resetPassword(
      { email, token, newPassword: data.password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully!");
          setIsSuccess(true);
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        },
        onError: (err: unknown) => {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to reset password. Please try again.";
          toast.error(errorMessage);
        },
      },
    );
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">
              Password Reset Successful!
            </h2>
            <p className="mb-6 text-muted-foreground">
              Your password has been updated successfully. Redirecting to
              login...
            </p>
            <Button asChild className="h-11 w-full font-medium">
              <Link href="/auth/login">Continue to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div>
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-brand/20 bg-brand/10">
            <Lock className="h-8 w-8 text-brand" />
          </div>
          <h1 className="mb-3 font-heading text-4xl font-normal text-foreground md:text-5xl">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isPending}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isPending}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isPending}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-14 w-full rounded-lg text-base font-medium transition-all"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>

        {/* Back to Login */}
        <div className="mt-6">
          <Button asChild variant="ghost" className="h-11 w-full font-medium">
            <Link href="/auth/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
