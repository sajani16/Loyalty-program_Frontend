"use client";

import Link from "next/link";
import { HeartHandshake, Globe, Share2, MessageCircle, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface text-muted py-10 md:py-12 border-t border-border-subtle/60 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Brand & Socials Column */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-brand-foreground shadow-sm">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="text-foreground font-black text-base tracking-tight">
                LoyaltyHub
              </span>
            </div>
            
            <p className="text-[11px] text-muted leading-relaxed max-w-xs font-bold">
              Turn every customer visit into a lasting relationship. The all-in-one digital loyalty platform for modern businesses.
            </p>

            {/* Generic Lucide Icons for Social Links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="#website"
                aria-label="Website"
                className="w-7 h-7 rounded-full bg-background border border-border-subtle flex items-center justify-center text-muted hover:text-brand hover:border-brand/40 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a
                href="#share"
                aria-label="Share"
                className="w-7 h-7 rounded-full bg-background border border-border-subtle flex items-center justify-center text-muted hover:text-brand hover:border-brand/40 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>
              <a
                href="#chat"
                aria-label="Chat"
                className="w-7 h-7 rounded-full bg-background border border-border-subtle flex items-center justify-center text-muted hover:text-brand hover:border-brand/40 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a
                href="#send"
                aria-label="Community"
                className="w-7 h-7 rounded-full bg-background border border-border-subtle flex items-center justify-center text-muted hover:text-brand hover:border-brand/40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Nav Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <h4 className="font-black text-foreground text-xs mb-3 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-[11px] font-bold">
                <li><Link href="#features" className="hover:text-brand transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-brand transition-colors">How It Works</Link></li>
                <li><Link href="#pricing" className="hover:text-brand transition-colors">Pricing</Link></li>
                <li><Link href="#security" className="hover:text-brand transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-foreground text-xs mb-3 uppercase tracking-wider">For Businesses</h4>
              <ul className="space-y-2 text-[11px] font-bold">
                <li><Link href="/auth/register?userType=business" className="hover:text-brand transition-colors">Register Business</Link></li>
                <li><Link href="/login" className="hover:text-brand transition-colors">Merchant Portal</Link></li>
                <li><Link href="#analytics" className="hover:text-brand transition-colors">Analytics</Link></li>
                <li><Link href="#pricing" className="hover:text-brand transition-colors">Agency Plans</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-foreground text-xs mb-3 uppercase tracking-wider">For Customers</h4>
              <ul className="space-y-2 text-[11px] font-bold">
                <li><Link href="/login" className="hover:text-brand transition-colors">Customer Portal</Link></li>
                <li><Link href="#my-cards" className="hover:text-brand transition-colors">Digital Wallet</Link></li>
                <li><Link href="#rewards" className="hover:text-brand transition-colors">Find Rewards</Link></li>
                <li><Link href="#mobile-app" className="hover:text-brand transition-colors">Web App Access</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-foreground text-xs mb-3 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-[11px] font-bold">
                <li><Link href="#about" className="hover:text-brand transition-colors">About Us</Link></li>
                <li><Link href="#careers" className="hover:text-brand transition-colors">Careers</Link></li>
                <li><Link href="#privacy" className="hover:text-brand transition-colors">Privacy Policy</Link></li>
                <li><Link href="#terms" className="hover:text-brand transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border-subtle/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-bold">
          <p>© 2026 LoyaltyHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#privacy" className="hover:text-brand transition-colors">Privacy</Link>
            <Link href="#terms" className="hover:text-brand transition-colors">Terms</Link>
            <Link href="#cookies" className="hover:text-brand transition-colors">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}