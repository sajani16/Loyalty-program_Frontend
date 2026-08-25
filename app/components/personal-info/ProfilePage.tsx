"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  useCustomerProfile,
  useUpdateCustomerProfile,
  useUpdateProfileImageMutation,
} from "@/customer/api";
import {
  useBusinessProfile,
  useUpdateBusinessProfile,
  useUpdateBusinessLogoMutation,
} from "@/merchant/api";

interface ProfilePageProps {
  onBack: () => void;
  userType: "customer" | "merchant";
}

/* ─── Skeleton Loader for Form ───────────────────────── */
function ProfileFormSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full max-w-md space-y-8 text-left animate-pulse">
      {/* Header Skeleton */}
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
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-md bg-border-subtle/60" />
          <div className="h-4 w-64 rounded-md bg-border-subtle/40" />
        </div>
      </div>

      <div className="space-y-6">
        {/* Avatar Skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-border-subtle/60 shrink-0" />
          <div className="h-8 w-28 rounded-md bg-border-subtle/40" />
        </div>

        {/* Input Skeletons */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="h-3 w-16 rounded bg-border-subtle/40" />
            <div className="h-10 w-full rounded-md bg-border-subtle/30" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-24 rounded bg-border-subtle/40" />
            <div className="h-10 w-full rounded-md bg-border-subtle/30" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-24 rounded bg-border-subtle/40" />
            <div className="h-10 w-full rounded-md bg-border-subtle/30" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="pt-2">
          <div className="h-10 w-full rounded-md bg-border-subtle/60" />
        </div>
      </div>
    </div>
  );
}

export function ProfilePage({ onBack, userType }: ProfilePageProps) {
  // Hooks for customer
  const customerProfile = useCustomerProfile();
  const updateCustomerProfile = useUpdateCustomerProfile();
  const updateProfileImage = useUpdateProfileImageMutation();

  // Hooks for merchant
  const merchantProfile = useBusinessProfile();
  const updateMerchantProfile = useUpdateBusinessProfile();
  const updateBusinessLogo = useUpdateBusinessLogoMutation();

  // Select appropriate hooks based on userType
  const profileQuery =
    userType === "customer" ? customerProfile : merchantProfile;
  const updateMutation =
    userType === "customer" ? updateCustomerProfile : updateMerchantProfile;
  const logoMutation =
    userType === "customer" ? updateProfileImage : updateBusinessLogo;

  const profileData = profileQuery.data;

  // Local Form & Image States
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Sync initial API data into local state
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        phone: profileData.phone || "",
      });
    }
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Select image & create local preview
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedFile) {
        await logoMutation.mutateAsync(selectedFile);
      }

      await updateMutation.mutateAsync(formData);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setSelectedFile(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  if (profileQuery.isLoading) {
    return <ProfileFormSkeleton onBack={onBack} />;
  }

  const existingImage =
    userType === "customer"
      ? (profileData as any)?.profileImage
      : (profileData as any)?.businessLogo;

  const currentImageSource = imagePreview || existingImage;
  const isSaving = updateMutation.isPending || logoMutation.isPending;

  return (
    <div className="w-full max-w-md space-y-8 text-left">
      {/* Navigation Header */}
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
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Profile Settings
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Manage your personal profile and preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Avatar Uploader */}
        <div className="flex items-center gap-4">
          <Avatar
            className="w-16 h-16 border"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <AvatarImage src={currentImageSource} className="object-cover" />
            <AvatarFallback
              className="text-sm font-medium"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
              }}
            >
              {profileData?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={isSaving}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-opacity border hover:opacity-80"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <Camera className="w-3.5 h-3.5" />
              {selectedFile ? "Change Selection" : "Upload Photo"}
            </label>
            {selectedFile && (
              <p className="mt-1 text-[11px]" style={{ color: "var(--brand)" }}>
                Selected: {selectedFile.name} (Pending Save)
              </p>
            )}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              disabled={isSaving}
              className="border transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border-subtle)",
                color: "var(--foreground)",
              }}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={profileData?.email || ""}
              disabled
              className="border opacity-60 cursor-not-allowed"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border-subtle)",
                color: "var(--muted)",
              }}
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-xs font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              disabled={isSaving}
              className="border transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border-subtle)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--brand)",
              color: "var(--brand-foreground)",
            }}
          >
            {isSaving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
