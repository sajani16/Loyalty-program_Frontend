import type { Metadata } from "next";
import {
  Inter,
  Roboto,
  Open_Sans,
  Playfair_Display,
  DM_Sans,
  Sora,
  Quicksand,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "LoyaltyHub — One QR Platform for Every Business Need",
  description:
    "Create digital identities, accept restaurant orders, generate QR codes, and build professional email signatures — all from one smart platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${dmSans.variable} ${quicksand.variable} ${inter.variable} ${roboto.variable} ${openSans.variable} ${playfairDisplay.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
