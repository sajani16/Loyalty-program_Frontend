"use client";

import { useRef } from "react";
import { useState } from "react";
import { QrCode, Download, Copy, Check, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRCodeDisplayProps {
  businessId: string;
  businessName: string;
}

// Simple QR code representation using canvas
function generateQRCodeImage(text: string): string {
  // Using a QR code API service since qrcode.react requires additional setup
  // This creates a QR code using qr-server.com API
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
}

export function QRCodeDisplay({ businessId, businessName }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(businessId);
    setCopied(true);
    toast.success("Copied", "Business ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(generateQRCodeImage(businessId));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${businessName}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Downloaded", "QR code downloaded successfully");
    } catch (error) {
      toast.error("Error", "Could not download QR code");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${businessName} - Loyalty Program`,
          text: `Join ${businessName}'s loyalty program! Scan to get started.`,
          url: window.location.href,
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      toast.info("Share", "Sharing not available. Try copying the Business ID instead.");
    }
  };

  return (
    <div className="bg-surface-card rounded-md border border-border-subtle p-6">
      {/* Header */}
      <div className="mb-5">
        <h3 className="font-bold text-foreground text-sm mb-1">Business QR Code</h3>
        <p className="text-xs text-muted">Share with customers to join your program</p>
      </div>

      {/* QR Code */}
      <div
        ref={qrRef}
        className="mb-5 flex justify-center p-4 bg-white rounded-lg border border-border-subtle"
      >
        <img
          src={generateQRCodeImage(businessId)}
          alt="Business QR Code"
          className="w-48 h-48"
        />
      </div>

      {/* Business ID Display */}
      <div className="mb-4 p-3 bg-surface rounded-md border border-border-subtle">
        <p className="text-xs text-muted mb-1">Business ID</p>
        <p className="font-mono text-xs font-bold text-foreground break-all">{businessId}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
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
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-surface border border-border-subtle text-foreground text-xs font-bold hover:bg-surface-card transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download QR
        </button>

        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-surface border border-border-subtle text-foreground text-xs font-bold hover:bg-surface-card transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share QR
        </button>
      </div>

      <p className="text-[10px] text-muted mt-4 text-center">
        Only your Business ID is encoded in the QR code
      </p>
    </div>
  );
}
