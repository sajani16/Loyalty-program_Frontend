import { redirect } from "next/navigation";

export const metadata = {
  title: "LoyaltyHub — Reward Your Customers, Grow Your Business",
  description:
    "LoyaltyHub connects customers and merchants through a seamless QR-based loyalty program. Scan, earn points, and unlock rewards instantly.",
};

import { Navbar } from "./home/components/Navbar";
import { HeroSection } from "./home/components/HeroSection";
import { HowItWorksSection } from "./home/components/HowItWorksSection";
import { FeaturesSection } from "./home/components/FeaturesSection";
import { Footer } from "./home/components/Footer";
import { DigitalWalletSection } from "./home/components/DigitalWalletSection";
import { BusinessExperienceSection } from "./home/components/BusinessExperienceSection";
import { CallToActionBanner } from "./home/components/CallToActionBanner";
import { BusinessTypesSection } from "./home/components/BusinessTypesSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-foreground transition-colors">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DigitalWalletSection />
      <BusinessExperienceSection />
      <HowItWorksSection />
      <CallToActionBanner />
      <BusinessTypesSection />
      <Footer />
    </div>
  );
}
