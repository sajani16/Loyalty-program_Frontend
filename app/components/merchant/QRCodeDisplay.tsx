"use client";

import { useState } from "react";
import { QrCode, Download, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRCodeDisplayProps {
  businessId: string;
  businessName: string;
}

export function QRCodeDisplay({ businessId, businessName }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(businessId);
    setCopied(true);
    toast.success("Copied", "Business ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Generate QR code as image and trigger download
    // Using qrcode library - requires installation
    toast.info("Download", "QR code download feature coming soon");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${businessName} - Loyalty Program`,
          text: `Join ${businessName}'s loyalty program`,
          url: window.location.href,
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      toast.info("Share", "Sharing not available on this device");
    }
  };

  return (
    <div className="bg-surface-card rounded-md border border-border-subtle p-6 text-center">
      {/* QR Code Placeholder */}
      <div className="mb-5 flex justify-center">
        <div className="w-40 h-40 bg-background border-2 border-dashed border-brand/30 rounded-md flex items-center justify-center">
          <div className="text-center">
            <QrCode className="w-12 h-12 text-brand/50 mx-auto mb-2" />
            <p className="text-xs text-muted">QR Code</p>
            <p className="text-[10px] text-muted mt-1">{businessId.slice(0, 8)}...</p>
          </div>
        </div>
      </div>

      {/* Business ID Display */}
      <div className="mb-4 p-3 bg-surface rounded-md border border-border-subtle">
        <p className="text-xs text-muted mb-1">Business ID</p>
        <p className="font-mono text-sm font-bold text-foreground break-all">{businessId}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy ID
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-surface border border-border-subtle text-foreground text-xs font-bold hover:bg-surface-card transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download QR
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-surface border border-border-subtle text-foreground text-xs font-bold hover:bg-surface-card transition-colors"
        >
          <QrCode className="w-3.5 h-3.5" />
          Share QR
        </button>
      </div>

      <p className="text-[10px] text-muted mt-4">
        Customers scan this QR code to join your loyalty program
      </p>
    </div>
  );
}
