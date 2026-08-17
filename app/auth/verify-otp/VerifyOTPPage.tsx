"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authService } from "@/services/auth.service";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const isRegister = searchParams.get("type") === "register";

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verifyEmail");

    if (!storedEmail || !isRegister) {
      router.push("/auth/forgot-password");
      return;
    }

    setEmail(storedEmail);
  }, [isRegister, router]);

  const handleVerify = async () => {
    if (otp.length !== 6 || !email) {
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(email, otp);
      toast.success("Email verified successfully! Please login to continue.");
      setSuccess(true);
      sessionStorage.removeItem("verifyEmail");

      setTimeout(() => {
        router.push(
          `/auth/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`,
        );
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      return;
    }

    setResending(true);
    try {
      await authService.resendOtp(email);
      toast.success("New code sent to your email!");
      setOtp("");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend code";
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">
              Email Verified!
            </h2>
            <p className="mb-6 text-muted-foreground">
              Your email has been verified successfully. Redirecting to login...
            </p>
            <Link
              href={`/auth/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            >
              <Button variant="default" className="h-11 w-full font-medium">
                Continue to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div>
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-brand/20 bg-brand/10">
            <Mail className="h-8 w-8 text-brand" />
          </div>
          <h1 className="mb-3 font-heading text-4xl font-normal text-foreground md:text-5xl">
            Verify Your Email
          </h1>
          <p className="mb-2 text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit code to
          </p>
          <p className="font-normal text-foreground">{email || "your email"}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Code expires in 5 minute
          </p>
        </div>

        <div className="mb-8">
          <div className="mb-6 flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value.replace(/\D/g, ""))}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="h-13 w-12 border-2 text-lg sm:h-14 sm:w-13"
                />
                <InputOTPSlot
                  index={1}
                  className="h-13 w-12 border-2 text-lg sm:h-14 sm:w-13"
                />
                <InputOTPSlot
                  index={2}
                  className="h-13 w-12 border-2 text-lg sm:h-14 sm:w-13"
                />
                <InputOTPSlot
                  index={3}
                  className="h-13 w-12 border-2 text-lg sm:h-14 sm:w-13"
                />
                <InputOTPSlot
                  index={4}
                  className="h-13 w-12 border-2 text-lg sm:h-14 sm:w-13"
                />
                <InputOTPSlot
                  index={5}
                  className="h-13 w-12 border-2 text-lg sm:h-14 sm:w-13"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button
          onClick={handleVerify}
          variant="default"
          className="mb-6 h-14 w-full rounded-lg text-base font-medium transition-all"
          disabled={loading || otp.length !== 6}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>

        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="mb-3 mt-6 text-sm text-muted-foreground">
            Didn&apos;t receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm font-medium text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <Link
            href={`/auth/register${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          >
            <Button
              variant="outline"
              className="h-14 w-full rounded-lg border-gray-200 font-medium transition-colors hover:bg-gray-50"
            >
              Back to Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
