"use client";

import { Store, QrCode, Gift } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    number: "1",
    title: "Discover",
    description: "Find local businesses and your favorite spots.",
    icon: Store,
  },
  {
    number: "2",
    title: "Scan & Earn",
    description:
      "Scan the QR code after your purchase and earn stamps or points instantly.",
    icon: QrCode,
  },
  {
    number: "3",
    title: "Redeem",
    description: "Reach your goal and redeem exciting rewards effectively.",
    icon: Gift,
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-t border-border-subtle/40 bg-slate-50 py-10 text-foreground md:py-14"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Compact Header */}
        <div className="mb-6 text-center">
          <span className="text-xs font-black text-brand uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-1">
            Earning Rewards is <span className="text-brand">Simple</span>
          </h2>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12">
          {/* Steps Horizontal Row */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-7 relative">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex items-center gap-4"
                >
                  {/* Icon Circle */}
                  <div className="w-18 h-17 rounded-full bg-brand-muted shrink-0 flex items-center justify-center">
                    <IconComponent className="w-10 h-10 text-brand" />
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-5 h-5 rounded-full bg-accent-pink text-foreground text-[12px] font-black flex items-center justify-center shrink-0">
                        {step.number}
                      </span>
                      <h3 className="text-sm font-black text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted leading-tight font-bold">
                      {step.description}
                    </p>
                  </div>

                  {/* Dashed Connector Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 w-6 z-10 pointer-events-none">
                      <svg
                        width="24"
                        height="12"
                        viewBox="0 0 24 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-brand/40"
                      >
                        <path
                          d="M2 9C6 2 18 2 22 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeDasharray="2.5 2.5"
                          fill="none"
                        />
                        <path
                          d="M18 6L22 9L18 11"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right How It Works Image */}
          <div className="mt-2 flex justify-center lg:col-span-4 lg:mt-0 lg:justify-end">
            <Image
              src="/howitworks.png"
              alt="Scanning a QR code to collect a reward"
              width={640}
              height={640}
              className="w-full max-w-[340px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
