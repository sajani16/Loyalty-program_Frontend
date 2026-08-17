"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Camera, CheckCircle, AlertCircle, Loader2, QrCode } from "lucide-react";
import { useScanQRMutation } from "../api";
import { toast } from "@/hooks/use-toast";

interface QRScannerModalProps {
  onClose: () => void;
}

type ScanState = "requesting" | "scanning" | "processing" | "success" | "error";

export default function QRScannerModal({ onClose }: QRScannerModalProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<unknown>(null);
  const [scanState, setScanState] = useState<ScanState>("requesting");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const isProcessingRef = useRef(false);

  const scanMutation = useScanQRMutation();

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        const scanner = html5QrCodeRef.current as {
          isScanning?: boolean;
          stop: () => Promise<void>;
          clear: () => Promise<void>;
        };
        if (scanner.isScanning) {
          await scanner.stop();
        }
        await scanner.clear();
      } catch {
        // ignore cleanup errors
      }
      html5QrCodeRef.current = null;
    }
  }, []);

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      const businessId = decodedText.trim();

      if (!businessId) {
        setErrorMsg("Invalid QR code. Please scan a valid merchant QR code.");
        setScanState("error");
        isProcessingRef.current = false;
        return;
      }

      setScanState("processing");
      await stopScanner();

      scanMutation.mutate(businessId, {
        onSuccess: (res) => {
          setScanState("success");
          setSuccessMsg(
            res?.message || "Loyalty request sent! The merchant will process your visit.",
          );
          toast.success("Loyalty request submitted!");
        },
        onError: (error) => {
          setScanState("error");
          setErrorMsg(
            error instanceof Error
              ? error.message
              : "Failed to submit loyalty request. Please try again.",
          );
          isProcessingRef.current = false;
        },
      });
    },
    [scanMutation, stopScanner],
  );

  const startScanner = useCallback(async () => {
    if (!scannerRef.current) return;

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      const scanner = new Html5Qrcode("qr-scanner-container");
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          void handleScanSuccess(decodedText);
        },
        undefined,
      );

      setScanState("scanning");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("denied")) {
        setErrorMsg("Camera permission denied. Please allow camera access and try again.");
      } else {
        setErrorMsg("Could not start camera. Please check camera access.");
      }
      setScanState("error");
    }
  }, [handleScanSuccess]);

  useEffect(() => {
    const t = setTimeout(() => {
      void startScanner();
    }, 400);

    return () => {
      clearTimeout(t);
      void stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    setErrorMsg("");
    setScanState("requesting");
    isProcessingRef.current = false;
    setTimeout(() => void startScanner(), 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-sm rounded-md overflow-hidden bg-surface-card border border-border-subtle shadow-2xl text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
              <QrCode className="w-3.5 h-3.5 text-brand-foreground" />
            </div>
            <div>
              <p className="font-bold text-foreground text-xs">Scan QR Code</p>
              <p className="text-[10px] text-muted">Point at merchant&apos;s QR code</p>
            </div>
          </div>
          <button
            id="qr-scanner-close"
            onClick={() => {
              void stopScanner();
              onClose();
            }}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport */}
        <div className="p-4">
          {(scanState === "requesting" || scanState === "scanning") && (
            <div className="relative">
              <div
                className="rounded-md overflow-hidden bg-black border border-border-subtle"
                style={{ aspectRatio: "1/1" }}
              >
                <div
                  id="qr-scanner-container"
                  ref={scannerRef}
                  className="w-full h-full"
                />
                {scanState === "scanning" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-44 h-44 border-2 border-brand rounded-md">
                      <div
                        className="absolute left-0 right-0 h-0.5 bg-brand"
                        style={{ animation: "scanLine 2s ease-in-out infinite" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {scanState === "requesting" && (
                <div className="absolute inset-0 rounded-md flex flex-col items-center justify-center gap-2 bg-background/90">
                  <div className="w-10 h-10 rounded-md bg-brand-muted border border-brand/30 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-brand" />
                  </div>
                  <p className="text-foreground font-medium text-xs">Starting camera...</p>
                  <Loader2 className="w-4 h-4 text-brand animate-spin" />
                </div>
              )}

              {scanState === "scanning" && (
                <div className="mt-2.5 flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  <p className="text-[11px] text-muted">Camera active — scanning for QR code</p>
                </div>
              )}
            </div>
          )}

          {scanState === "processing" && (
            <div className="flex flex-col items-center justify-center py-8 gap-2.5">
              <div className="w-10 h-10 rounded-md bg-brand flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-brand-foreground animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground text-xs">Processing scan...</p>
                <p className="text-[11px] text-muted">Submitting your loyalty request</p>
              </div>
            </div>
          )}

          {scanState === "success" && (
            <div className="flex flex-col items-center justify-center py-6 gap-2.5">
              <div className="w-10 h-10 rounded-md bg-brand-muted border border-brand flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-brand" />
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground text-xs mb-0.5">Request Sent!</p>
                <p className="text-[11px] text-muted leading-relaxed max-w-xs mx-auto">
                  {successMsg}
                </p>
              </div>
              <button
                id="qr-scanner-done"
                onClick={() => {
                  void stopScanner();
                  onClose();
                }}
                className="mt-1 w-full py-2 px-3 rounded-md bg-brand text-brand-foreground font-bold text-xs hover:opacity-90 transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {scanState === "error" && (
            <div className="flex flex-col items-center justify-center py-6 gap-2.5">
              <div className="w-10 h-10 rounded-md bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground text-xs mb-0.5">Something went wrong</p>
                <p className="text-[11px] text-muted leading-relaxed max-w-xs mx-auto">
                  {errorMsg}
                </p>
              </div>
              <button
                id="qr-scanner-retry"
                onClick={handleRetry}
                className="w-full py-2 px-3 rounded-md bg-brand text-brand-foreground font-bold text-xs hover:opacity-90 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
