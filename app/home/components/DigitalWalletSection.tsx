"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

const features = [
  "No lost cards",
  "No paper clutter",
  "All rewards in one place",
  "Track progress easily",
  "Instant reward notices",
];

export function DigitalWalletSection() {
  const router = useRouter();

  const handleCustomerJoin = () => {
    router.push("/login");
  };

  return (
    <section className="overflow-hidden border-t border-accent-pink/30 bg-accent-pink-muted py-10 text-foreground md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          {/* Left Column: Digital Wallet Image */}
          <div className="order-2 mt-2 flex justify-center lg:col-span-6 lg:order-1 lg:mt-0 lg:justify-start">
            <Image
              src="/customer.png"
              alt="Digital wallet with loyalty cards"
              width={640}
              height={640}
              className="w-full max-w-[500px] object-contain"
            />
          </div>

          {/* Right Column: Text & Controlled CTA */}
          <div className="order-1 text-left lg:col-span-6 lg:order-2">
            <span className="text-xs font-black text-brand uppercase tracking-wider block mb-1.5">
              ALL YOUR REWARDS IN ONE PLACE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight mb-4">
              From Wallet Full of Cards <br />
              to <span className="text-brand">One Digital Wallet</span>
            </h2>

            {/* Checklist */}
            <ul className="space-y-2.5 mb-6">
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 text-sm font-bold text-foreground/80"
                >
                  <div className="w-4 h-4 rounded-full bg-brand-muted flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Controlled Customer Join CTA Button */}
            <button
              onClick={handleCustomerJoin}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand text-brand-foreground font-black text-sm hover:bg-brand-dark transition-all shadow-sm"
            >
              Join as Customer
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
