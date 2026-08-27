"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

const businessBenefits = [
  "Increase repeat customer visits",
  "Automate points and rewards distribution",
  "Gain valuable business insights & analytics",
  "Boost customer engagement effortlessly",
  "Turn every visit into a loyal relationship",
];

export function BusinessExperienceSection() {
  const router = useRouter();

  const handleExploreBusiness = () => {
    router.push("/auth/register?userType=business");
  };

  return (
    <section className="overflow-hidden border-t border-accent-pink/30 bg-[#F4F6F8] py-12 text-foreground md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-32">
          {" "}
          {/* Left Column */}
          <div className="text-left lg:col-span-5 lg:pl-4">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-brand">
              Business Experience
            </span>

            <h2 className="mb-4 text-3xl font-black leading-tight text-foreground sm:text-4xl">
              Turn Every Visit Into a{" "}
              <span className="text-brand">Loyal Relationship.</span>
            </h2>

            <ul className="mb-8 space-y-3">
              {businessBenefits.map((benefit, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-sm font-bold text-foreground/80"
                >
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-muted">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                  </div>

                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleExploreBusiness}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-black text-brand-foreground shadow-md transition-all hover:bg-brand-dark active:scale-95"
            >
              Explore Business
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {/* Right Column */}
          <div className="flex justify-center lg:col-span-7 lg:justify-start">
            <div className="w-full max-w-[440px]">
              {/* MacBook Screen */}
              <div className="relative rounded-[11px] bg-[#000000] p-[8px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.32)] ring-1 ring-black/10">
                <div className="absolute left-1/2 top-[2px] z-20 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-neutral-600" />

                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[7px] bg-[#111113] ring-1 ring-black/40">
                  <Image
                    src="/dashboard.jpg"
                    alt="LoyaltyHub Business Dashboard"
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 90vw, 440px"
                  />
                </div>
              </div>

              {/* Hinge */}
              <div className="relative mx-auto h-[3px] w-[88%] bg-neutral-700" />

              {/* Laptop Base */}
              <div className="relative mx-auto h-[7px] w-[94%] rounded-b-[7px] bg-gradient-to-b from-neutral-500 to-neutral-800 shadow-[0_6px_10px_-5px_rgba(0,0,0,0.3)]">
                <div className="absolute left-1/2 top-0 h-[1px] w-12 -translate-x-1/2 rounded-b-full bg-neutral-800/60" />
              </div>

              {/* Ground Shadow */}
              <div className="mx-auto mt-1 h-[3px] w-[67%] rounded-full bg-black/10 blur-[2px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
