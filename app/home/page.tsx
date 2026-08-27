import { redirect } from "next/navigation";

export const metadata = {
  title: "LoyaltyHub — Reward Your Customers, Grow Your Business",
  description:
    "LoyaltyHub connects customers and merchants through a seamless QR-based loyalty program. Scan, earn points, and unlock rewards instantly.",
};

export default function HomePage() {
  redirect("/");
}
