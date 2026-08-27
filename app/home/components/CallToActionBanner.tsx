"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Store, Coffee } from "lucide-react";
import Image from "next/image";

export function CallToActionBanner() {
  const router = useRouter();

  return (
    <section className="overflow-hidden bg-slate-50 py-10 text-foreground md:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Banner Container */}
        <div className="relative rounded-[24px] bg-accent-pink/40 border border-accent-pink/50 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side: Scaled Cup Image with Refined Single Badge */}
          <div className="relative z-10 shrink-0 flex items-center justify-center">
            <div className="relative w-56 sm:w-64 md:w-72">
              <Image
                src="/cup.png"
                alt="Cup representing a coffee loyalty reward"
                width={420}
                height={420}
                className="h-48 sm:h-56 md:h-60 w-full object-contain drop-shadow-md"
              />

              {/* Refined Single Badge (Top Right of Cup) */}
              <div className="absolute top-2 -right-1 sm:-right-3 bg-white/95 backdrop-blur-md text-foreground rounded-full px-3.5 py-1.5 shadow-lg border border-border-subtle flex items-center gap-2">
                <Coffee className="w-4 h-4 text-brand shrink-0" />
                <span className="text-xs font-black tracking-tight whitespace-nowrap">
                  Free Coffee Unlocked!
                </span>
              </div>
            </div>
          </div>

          {/* Middle Content: Headline & Dual CTAs */}
          <div className="relative z-10 text-center md:text-left flex-1 max-w-xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground leading-tight mb-2">
              Stop Carrying Loyalty Cards. <br />
              <span className="text-brand">Start Collecting Rewards.</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted mb-5 leading-relaxed font-bold">
              Join thousands of customers and local businesses already using
              digital rewards daily.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-brand text-brand-foreground font-black text-xs sm:text-sm hover:bg-brand-dark transition-all shadow-sm active:scale-95"
              >
                Join as Customer
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => router.push("/auth/register?userType=business")}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-brand/30 bg-surface text-brand font-black text-xs sm:text-sm hover:bg-brand-muted transition-all active:scale-95"
              >
                <Store className="w-3.5 h-3.5" />
                For Businesses
              </button>
            </div>
          </div>

          {/* Right Side: Larger Decorative Plant Image */}
          <div className="hidden lg:block relative z-10 w-44 shrink-0">
            <Image
              src="/plant.png"
              alt="Small potted plant"
              width={290}
              height={290}
              className="h-48 w-full object-contain drop-shadow-sm"
            />
          </div>

          {/* Subtle Background Glow Accent */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
