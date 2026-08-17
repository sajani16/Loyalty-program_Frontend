import { Suspense } from "react";
import Link from "next/link";
import { QrCode } from "lucide-react";
import { UserTypeIndicator } from "@/components/ui/UserTypeIndicator";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import AuthSkeleton from "./AuthSkeleton";

interface AuthLayoutProps {
  children: React.ReactNode;
  searchParams?: Promise<{ userType?: string; callbackUrl?: string }>;
}

export default async function AuthLayout({
  children,
  searchParams,
}: AuthLayoutProps) {
  const params = await searchParams;
  const rawUserType = params?.userType;

  const userType: "customer" | "business" =
    rawUserType === "business" ? "business" : "customer";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border-subtle bg-surface">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
            <QrCode className="w-4 h-4 text-brand-foreground" />
          </div>
          <span className="text-base font-bold text-foreground">
            Loyalty<span className="text-brand">Hub</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/" className="text-xs text-muted hover:text-brand transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>

      {/* User type indicator */}
      <Suspense fallback={<div className="h-9 bg-surface border-b border-border-subtle animate-pulse" />}>
        <UserTypeIndicator userType={userType} />
      </Suspense>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-surface-card rounded-md border border-border-subtle p-6 shadow-sm">
            <Suspense fallback={<AuthSkeleton />}>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
