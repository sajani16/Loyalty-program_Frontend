"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  ChevronDown,
  Menu,
  X,
  Gift,
  Store,
  UserCheck,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  ScanLine,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/* ─────────────────────────────────────────────
   Sign In Dropdown
───────────────────────────────────────────── */
function SignInDropdown({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  return (
    <div className="absolute right-0 top-full mt-2 w-60 rounded-md bg-surface-card border border-border-subtle shadow-xl overflow-hidden z-50">
      <div className="p-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted px-2 mb-2">
          Sign in as
        </p>
        <button
          id="signin-customer"
          onClick={() => {
            router.push("/auth/login?userType=customer");
            onClose();
          }}
          className="w-full flex items-center gap-2.5 p-2 rounded-md bg-surface hover:bg-border-subtle/40 border border-border-subtle transition-all group mb-1.5 text-left"
        >
          <div className="w-7 h-7 rounded-md bg-brand-muted border border-brand/30 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-3.5 h-3.5 text-brand" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-xs">Customer</p>
            <p className="text-[10px] text-muted">Earn points & rewards</p>
          </div>
        </button>
        <button
          id="signin-merchant"
          onClick={() => {
            router.push("/auth/login?userType=business");
            onClose();
          }}
          className="w-full flex items-center gap-2.5 p-2 rounded-md bg-surface hover:bg-border-subtle/40 border border-border-subtle transition-all group text-left"
        >
          <div className="w-7 h-7 rounded-md bg-brand-muted border border-brand/30 flex items-center justify-center flex-shrink-0">
            <Store className="w-3.5 h-3.5 text-brand" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-xs">Business</p>
            <p className="text-[10px] text-muted">Manage your program</p>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Navbar
───────────────────────────────────────────── */
function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-3 bg-surface/90 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center font-bold">
            <QrCode className="w-4 h-4 text-brand-foreground" />
          </div>
          <span className="text-base font-bold text-foreground">
            Loyalty<span className="text-brand">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="text-xs font-medium text-muted hover:text-foreground transition-colors">How It Works</a>
          <a href="#features" className="text-xs font-medium text-muted hover:text-foreground transition-colors">Features</a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-2 relative" ref={dropdownRef}>
            <button
              id="navbar-signin-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-all"
            >
              Sign In
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>
            {showDropdown && <SignInDropdown onClose={() => setShowDropdown(false)} />}
          </div>

          <button
            className="sm:hidden w-8 h-8 flex items-center justify-center rounded-md text-foreground border border-border-subtle bg-surface-card"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border-subtle bg-surface px-4 py-3 mt-2 space-y-2">
          <Link
            href="/auth/login?userType=customer"
            className="flex items-center gap-2 w-full p-2 rounded-md bg-brand-muted text-brand border border-brand/30 font-medium text-xs"
            onClick={() => setMobileOpen(false)}
          >
            <UserCheck className="w-4 h-4" /> Customer Sign In
          </Link>
          <Link
            href="/auth/login?userType=business"
            className="flex items-center gap-2 w-full p-2 rounded-md bg-surface-card text-foreground border border-border-subtle font-medium text-xs"
            onClick={() => setMobileOpen(false)}
          >
            <Store className="w-4 h-4 text-brand" /> Business Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────── */
function HeroSection() {
  const router = useRouter();

  return (
    <section className="pt-24 pb-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-muted text-brand text-xs font-semibold mb-6 border border-brand/30">
          <Sparkles className="w-3.5 h-3.5" />
          Simplest Loyalty Platform
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
          QR-Powered Loyalty for <span className="text-brand">Every Business</span>
        </h1>

        <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mb-8 leading-relaxed">
          Create custom loyalty rewards in minutes. Customers scan your QR code with any camera to earn points instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs sm:max-w-none mx-auto">
          <button
            onClick={() => router.push("/auth/register?userType=business")}
            className="px-5 py-2.5 rounded-md bg-brand text-brand-foreground font-bold text-xs hover:opacity-90 transition-all"
          >
            Start as Business
          </button>
          <button
            onClick={() => router.push("/auth/register?userType=customer")}
            className="px-5 py-2.5 rounded-md border border-border-subtle bg-surface text-foreground font-semibold text-xs hover:border-brand hover:text-brand transition-all"
          >
            Join as Customer
          </button>
        </div>

        {/* Clean minimal preview card */}
        <div className="mt-12 max-w-md mx-auto p-4 rounded-md bg-surface-card border border-border-subtle shadow-sm text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-brand flex items-center justify-center">
                <QrCode className="w-3.5 h-3.5 text-brand-foreground" />
              </div>
              <span className="text-xs font-bold text-foreground">LoyaltyHub Card</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand-muted text-brand font-semibold border border-brand/20">Active</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-[10px] text-muted">Total Points</p>
              <p className="text-2xl font-bold text-brand">1,240</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted">Status</p>
              <p className="text-xs font-semibold text-foreground">Gold Tier Member</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   How It Works
───────────────────────────────────────────── */
const steps = [
  {
    icon: Store,
    title: "1. Business registers",
    desc: "Get your unique QR code and set up rewards in under 2 minutes.",
  },
  {
    icon: ScanLine,
    title: "2. Customer scans QR",
    desc: "Customers point their smartphone camera at the code during checkout.",
  },
  {
    icon: Gift,
    title: "3. Points & rewards flow",
    desc: "Confirm the visit and points update automatically in real-time.",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 bg-surface border-t border-border-subtle">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold text-foreground mb-2">How It Works</h2>
          <p className="text-xs text-muted">Three simple steps to start rewarding customers</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-4 rounded-md bg-surface-card border border-border-subtle">
              <div className="w-8 h-8 rounded-md bg-brand-muted border border-brand/30 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-brand" />
              </div>
              <h3 className="text-xs font-bold text-foreground mb-1">{title}</h3>
              <p className="text-[11px] text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Features Section
───────────────────────────────────────────── */
const features = [
  { icon: QrCode, title: "QR-First Experience", desc: "No downloads required." },
  { icon: Zap, title: "Instant Sync", desc: "Real-time point updates." },
  { icon: Shield, title: "Secure Authentication", desc: "Encrypted role-based access." },
  { icon: Users, title: "Customer Tiers", desc: "Reward repeat customers." },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-background border-t border-border-subtle">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold text-foreground mb-2">Platform Features</h2>
          <p className="text-xs text-muted">Everything needed for modern customer retention</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-3.5 rounded-md bg-surface-card border border-border-subtle text-center">
              <div className="w-7 h-7 rounded-md bg-brand-muted flex items-center justify-center mx-auto mb-2">
                <Icon className="w-3.5 h-3.5 text-brand" />
              </div>
              <h3 className="text-xs font-bold text-foreground mb-0.5">{title}</h3>
              <p className="text-[10px] text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Footer
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-surface text-muted py-6 border-t border-border-subtle text-xs">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-brand flex items-center justify-center">
            <QrCode className="w-3.5 h-3.5 text-brand-foreground" />
          </div>
          <span className="text-foreground font-bold">LoyaltyHub</span>
        </div>
        <p className="text-[11px]">© 2026 LoyaltyHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
