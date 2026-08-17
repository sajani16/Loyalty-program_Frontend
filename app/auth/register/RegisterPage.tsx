"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  Store,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  registerSchema,
  type RegisterSchema,
} from "@/validations/auth.validation";

import { useRegisterMutation } from "../api";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const urlUserType = searchParams.get("userType") || "customer";

  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useRegisterMutation();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      userType: urlUserType === "business" ? "business" : "customer",
    },
  });

  const { control, handleSubmit, watch } = form;
  const currentUserType = watch("userType");
  const isBusiness = currentUserType === "business";

  const onSubmit = (data: RegisterSchema) => {
    registerMutation.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        userType: data.userType,
      },
      {
        onSuccess: () => {
          sessionStorage.setItem("verifyEmail", data.email);
          sessionStorage.setItem("verifyUserType", data.userType);

          toast.success(
            "Account created! Please verify your email with the OTP sent.",
          );

          router.push(
            `/auth/verify-otp?type=register&userType=${data.userType}${
              callbackUrl
                ? `&callbackUrl=${encodeURIComponent(callbackUrl)}`
                : ""
            }`,
          );
        },

        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Registration failed. Please try again.",
          );
        },
      },
    );
  };

  const isLoading = registerMutation.isPending;

  const onError = (errors: Record<string, unknown>) => {
    console.error("Form Validation Errors:", errors);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-foreground mb-1">Create your account</h1>
        <p className="text-xs text-muted">Join LoyaltyHub and start earning rewards</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="space-y-4"
        >
          {/* Account Type Selector */}
          <FormField
            control={control}
            name="userType"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs text-foreground">
                  I am a <span className="text-brand">*</span>
                </FormLabel>

                <FormControl>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      id="register-type-customer"
                      type="button"
                      onClick={() => field.onChange("customer")}
                      disabled={isLoading}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-md border text-xs font-semibold transition-all ${
                        field.value === "customer"
                          ? "border-brand bg-brand-muted text-brand"
                          : "border-border-subtle bg-surface text-muted hover:border-brand/40 hover:text-foreground"
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      Customer
                    </button>

                    <button
                      id="register-type-merchant"
                      type="button"
                      onClick={() => field.onChange("business")}
                      disabled={isLoading}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-md border text-xs font-semibold transition-all ${
                        field.value === "business"
                          ? "border-brand bg-brand-muted text-brand"
                          : "border-border-subtle bg-surface text-muted hover:border-brand/40 hover:text-foreground"
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      Business
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name Field */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-foreground">
                  {isBusiness ? "Business Name" : "Full Name"}{" "}
                  <span className="text-brand">*</span>
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />

                    <Input
                      {...field}
                      id="register-name"
                      placeholder={isBusiness ? "Coffee Palace Ltd." : "John Doe"}
                      disabled={isLoading}
                      className="pl-9 h-10 rounded-md bg-surface border-border-subtle text-xs text-foreground placeholder:text-muted focus:border-brand"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-foreground">
                  Email Address <span className="text-brand">*</span>
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />

                    <Input
                      {...field}
                      id="register-email"
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
                <FormLabel className="text-xs text-foreground">
                  Password <span className="text-brand">*</span>
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />

                    <Input
                      {...field}
                      id="register-password"
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

          {/* Submit Button */}
          <Button
            id="register-submit-btn"
            type="submit"
            className="w-full h-10 text-sm font-bold rounded-md bg-brand text-brand-foreground hover:opacity-90 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="my-5 relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center text-[11px]">
          <span className="bg-surface-card px-2 text-muted whitespace-nowrap">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Navigation back to Sign In */}
      <Link
        href={`/auth/login?userType=${currentUserType}${
          callbackUrl
            ? `&callbackUrl=${encodeURIComponent(callbackUrl)}`
            : ""
        }`}
      >
        <Button
          id="register-signin-link"
          variant="outline"
          className="w-full h-10 text-xs font-medium rounded-md border-border-subtle bg-surface text-foreground hover:border-brand hover:text-brand transition-all"
        >
          Sign In
        </Button>
      </Link>
    </div>
  );
}
