"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QrCode, ChevronDown, Store, UserCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/* ─────────────────────────────────────────────
   Minimal Sign In Dropdown
───────────────────────────────────────────── */
function SignInDropdown({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  return (
    <div className="absolute right-0 top-full mt-2 w-52 sm:w-56 rounded-xl bg-surface-card border border-border-subtle/60 shadow-lg p-1.5 z-50">
      <div className="px-2.5 py-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
          Sign in as
        </p>
      </div>

      <button
        id="signin-customer"
        onClick={() => {
          router.push("/auth/login?userType=customer");
          onClose();
        }}
        className="w-full flex items-center gap-2.5 sm:gap-3 px-2 py-1.5 sm:py-2 transition-colors text-left group"
      >
        <div className="w-7 h-7 bg-brand-muted flex items-center justify-center shrink-0">
          <UserCheck className="w-4 h-4 text-brand" />
        </div>
        <div>
          <p className="font-bold text-foreground text-xs leading-none mb-0.5 group-hover:text-brand transition-colors">
            Customer
          </p>
          <p className="text-[10px] text-muted">Earn points & rewards</p>
        </div>
      </button>

      {/* Hairline Green Divider */}
      <div className="my-0.5 border-t border-brand/20 w-full" />

      <button
        id="signin-merchant"
        onClick={() => {
          router.push("/auth/login?userType=business");
          onClose();
        }}
        className="w-full flex items-center gap-2.5 sm:gap-3 px-2 py-1.5 sm:py-2 transition-colors text-left group"
      >
        <div className="w-7 h-7 bg-brand-muted flex items-center justify-center shrink-0 mt-2">
          <Store className="w-4 h-4 text-brand" />
        </div>
        <div>
          <p className="font-bold text-foreground text-xs leading-none mb-0.5 group-hover:text-brand transition-colors">
            Business
          </p>
          <p className="text-[10px] text-muted">Manage your program</p>
        </div>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Navbar
───────────────────────────────────────────── */
export function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-slate-100/95 py-3 sm:py-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand flex items-center justify-center font-bold">
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-brand-foreground" />
          </div>
          <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            Loyalty<span className="text-brand">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Features
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Rounded Sign-In Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="navbar-signin-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-brand text-brand-foreground text-xs sm:text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Sign In
              <ChevronDown
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showDropdown && (
              <SignInDropdown onClose={() => setShowDropdown(false)} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
