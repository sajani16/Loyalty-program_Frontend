import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "./LandingPage";

export const metadata = {
  title: "LoyaltyHub — Reward Your Customers, Grow Your Business",
  description:
    "LoyaltyHub connects customers and merchants through a seamless QR-based loyalty program. Scan, earn points, and unlock rewards instantly.",
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is logged in, redirect to their dashboard based on role
  if (session?.user) {
    const userType = (session.user as any).userType;

    if (userType === "business" || userType === "merchant") {
      redirect("/merchant/dashboard");
    } else if (userType === "customer") {
      redirect("/customer/membership");
    }
  }

  return <LandingPage />;
}
