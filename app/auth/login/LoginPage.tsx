"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Loader2, QrCode } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginSchema } from "@/validations/auth.validation";
import VerificationModal from "../components/VerificationModal";

import { useLoginMutation } from "../api";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const userType = searchParams.get("userType") === "business" ? "business" : "customer";
  const callbackUrl = searchParams.get("callbackUrl");

  const defaultRedirect =
    userType === "business" ? "/merchant/dashboard" : "/customer/dashboard";
  const resolvedCallbackUrl = callbackUrl || defaultRedirect;

  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const loginMutation = useLoginMutation();

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      toast.error(decodeURIComponent(error));

      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(
      {
        email: data.email,
        password: data.password,
        userType,
      },
      {
        onSuccess: (res) => {
          if (!res?.ok) {
            toast.error("Unable to sign in");
            return;
          }

          toast.success("Welcome back!");
          router.push(resolvedCallbackUrl);
        },

        onError: (error) => {
          const errorMessage = error.message;

          if (
            errorMessage.includes("not verified") ||
            errorMessage.includes("Email not verified")
          ) {
            setUnverifiedEmail(data.email);
            setShowVerificationModal(true);
            return;
          }

          toast.error(errorMessage || "Invalid email or password");
        },
      },
    );
  };

  const isLoading = loginMutation.isPending;
  const isBusiness = userType === "business";

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-10 h-10 rounded-md mx-auto mb-3 flex items-center justify-center bg-brand-muted border border-brand/30">
            <QrCode className="w-5 h-5 text-brand" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1">
            Welcome back
          </h1>
          <p className="text-xs text-muted">
            Sign in to your {isBusiness ? "business" : "customer"} account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-foreground">Email Address</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />

                      <Input
                        {...field}
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        className="pl-9 h-10 rounded-md bg-surface border-border-subtle text-xs text-foreground placeholder:text-muted focus:border-brand"
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-foreground">Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />

                      <Input
                        {...field}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="pl-9 pr-9 h-10 rounded-md bg-surface border-border-subtle text-xs text-foreground placeholder:text-muted focus:border-brand"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href={`/auth/forgot-password?userType=${userType}`}
                className="text-xs font-medium text-brand hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              id="login-submit-btn"
              type="submit"
              className="w-full h-10 text-sm font-bold rounded-md transition-all bg-brand text-brand-foreground hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-5 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-surface-card px-2 text-muted">
                Don&apos;t have an account?
              </span>
            </div>
          </div>

          {/* Register Redirect */}
          <Link
            href={`/auth/register?userType=${userType}${
              callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ""
            }`}
          >
            <Button
              id="login-register-link"
              variant="outline"
              className="w-full h-10 text-xs font-medium rounded-md border-border-subtle bg-surface text-foreground hover:border-brand hover:text-brand transition-all"
            >
              Create Account
            </Button>
          </Link>
        </Form>
      </div>

      {showVerificationModal && (
        <VerificationModal
          email={unverifiedEmail}
          onClose={() => setShowVerificationModal(false)}
        />
      )}
    </>
  );
}
