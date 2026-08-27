"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Gift } from "lucide-react";
import Image from "next/image";
import heroBg from "../../../public/hero.png";
export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-brand-muted/45 pt-28 pb-8 text-foreground md:pt-38 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand-muted text-brand text-xs font-black mb-3 border border-brand/15 uppercase tracking-wide">
              Digital Loyalty Rewards
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-3">
              Your Rewards. <br />
              <span className="text-brand">Always With You.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted max-w-lg mb-5 leading-relaxed font-bold">
              Collect stamps and points from your favorite businesses without
              carrying physical cards. All your rewards. One beautiful wallet.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => router.push("/auth/register?userType=customer")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-brand-foreground font-black text-sm hover:bg-brand-dark transition-all shadow-sm"
              >
                Start Earning
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => router.push("#how-it-works")}
                className="inline-flex items-center px-5 py-2.5 rounded-full border border-border-subtle bg-surface text-foreground font-black text-sm hover:border-brand hover:text-brand transition-all"
              >
                Explore How It Works
              </button>
            </div>

            {/* Checkmark Bullets */}
            <div className="flex items-center gap-4 pt-4 border-t border-border-subtle/60">
              <div className="flex items-center gap-1.5 text-xs font-black text-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>No Physical Cards</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>Instant Rewards</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>All In One Place</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative flex items-center justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-full max-w-[520px]">
              <Image
                src={heroBg}
                alt="Loyalty rewards app preview"
                width={960}
                height={720}
                className="h-auto w-full object-contain"
                priority
              />

              {/* Floating Badge */}
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 bg-surface text-foreground rounded-xl px-3 py-1.5 shadow-md border border-border-subtle flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-muted flex items-center justify-center">
                  <Gift className="w-3 h-3 text-brand" />
                </div>
                <span className="text-xs font-black">
                  Coffee reward unlocked! ☕
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
