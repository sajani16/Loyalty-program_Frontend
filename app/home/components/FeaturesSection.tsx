"use client";

import {
  CreditCard,
  Stamp,
  Coins,
  QrCode,
  BarChart3,
  Users,
} from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Digital Loyalty Cards",
    desc: "Replace physical cards with seamless digital passes.",
    badgeBg: "bg-brand text-brand-foreground",
  },
  {
    icon: Stamp,
    title: "Stamp Rewards",
    desc: "Collect stamps and unlock custom perks.",
    badgeBg: "bg-accent-pink/50 text-brand",
  },
  {
    icon: Coins,
    title: "Points Rewards",
    desc: "Earn points with purchases and redeem easily.",
    badgeBg: "bg-brand-muted text-brand",
  },
  {
    icon: QrCode,
    title: "QR-Based Earning",
    desc: "Scan QR codes instantly with no app downloads.",
    badgeBg: "bg-accent-pink/50 text-brand",
  },
  {
    icon: BarChart3,
    title: "Reward Tracking",
    desc: "Track real-time progress and active rewards.",
    badgeBg: "bg-brand-muted text-brand",
  },
  {
    icon: Users,
    title: "Smart Dashboards",
    desc: "Powerful analytics for modern businesses and customers.",
    badgeBg: "bg-accent-pink/50 text-brand",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-t border-border-subtle/40 bg-slate-50 py-10 md:py-14"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Everything You Need for{" "}
            <span className="text-brand">Modern Loyalty</span>
          </h2>
        </div>

        {/* 6-Column Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {features.map(({ icon: Icon, title, desc, badgeBg }) => (
            <div
              key={title}
              className="p-4 rounded-2xl bg-surface border border-border-subtle/60 text-center flex flex-col items-center justify-start shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Circular Icon Badge */}
              <div
                className={`w-10 h-10 rounded-full ${badgeBg} flex items-center justify-center mb-3 shrink-0 shadow-sm`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-black text-foreground mb-1 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-muted leading-relaxed font-bold">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
