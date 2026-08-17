"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/validations/auth.validation";
import { useForgotPasswordMutation } from "../api"; // Adjust path as needed

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    forgotPassword(data.email, {
      onSuccess: () => {
        toast.success("Reset link sent to your email");
        form.reset();
        router.push("/auth/login");
      },
      onError: (err: unknown) => {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to send reset link. Please try again.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="w-full">
      <div>
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-brand/20 bg-brand/10">
            <Mail className="h-8 w-8 text-brand" />
          </div>
          <h1 className="mb-3 font-heading text-4xl font-normal text-foreground md:text-5xl">
            Forgot Password?
          </h1>
          <p className="text-sm text-muted-foreground">
            No worries, we&apos;ll send you a reset link
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@example.com"
                        disabled={isPending}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="default"
              className="h-14 w-full rounded-lg text-base font-medium transition-all"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>

        {/* Back to Login */}
        <div className="mt-8 border-t border-border pt-6">
          <Button
            asChild
            variant="outline"
            className="h-14 w-full rounded-lg border-border font-medium hover:bg-accent transition-colors"
            disabled={isPending}
          >
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
