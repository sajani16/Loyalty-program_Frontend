"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useChangeCustomerPasswordMutation } from "@/customer/api";
import { useChangeBusinessPasswordMutation } from "@/merchant/api";

interface ChangePasswordPageProps {
  onBack: () => void;
  userType: "customer" | "merchant";
}

export function ChangePasswordPage({ onBack, userType }: ChangePasswordPageProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const changeCustomerPassword = useChangeCustomerPasswordMutation();
  const changeBusinessPassword = useChangeBusinessPasswordMutation();
  const mutation = userType === "customer" ? changeCustomerPassword : changeBusinessPassword;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await mutation.mutateAsync({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast({
        title: "Success",
        description: "Password changed successfully",
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to change password";

      if (errorMessage.includes("incorrect")) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect",
        }));
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="w-full max-w-md space-y-8 text-left">
      {/* Header */}
      <div className="space-y-3">
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase transition-opacity hover:opacity-75"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            Change Password
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Update your account credentials
          </p>
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handleChangePassword} className="space-y-5">
        {/* Current Password */}
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword" className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
            Current Password
          </Label>
          <div className="relative">
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter current password"
              disabled={mutation.isPending}
              className="pr-10 border transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: errors.currentPassword ? "#ef4444" : "var(--border-subtle)",
                color: "var(--foreground)",
              }}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
              style={{ color: "var(--muted)" }}
            >
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-500">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
            New Password
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="At least 8 characters"
              disabled={mutation.isPending}
              className="pr-10 border transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: errors.newPassword ? "#ef4444" : "var(--border-subtle)",
                color: "var(--foreground)",
              }}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
              style={{ color: "var(--muted)" }}
            >
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter new password"
              disabled={mutation.isPending}
              className="pr-10 border transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: errors.confirmPassword ? "#ef4444" : "var(--border-subtle)",
                color: "var(--foreground)",
              }}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
              style={{ color: "var(--muted)" }}
            >
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--brand)",
              color: "var(--brand-foreground)",
            }}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}