"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

interface VerificationModalProps {
  email: string;
  onClose: () => void;
}

export default function VerificationModal({ email, onClose }: VerificationModalProps) {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await authService.resendOtp(email);
      toast.success("Verification code sent to your email");
      // Store email in sessionStorage and navigate to verify page
      sessionStorage.setItem("verifyEmail", email);
      router.push("/auth/verify-otp?type=register");
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send code";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Email Not Verified</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Your account isn&apos;t verified yet. Please verify your email before logging in.
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleResendOtp}
            disabled={isResending}
            variant="default"
            className="flex-1"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Verify Now"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

