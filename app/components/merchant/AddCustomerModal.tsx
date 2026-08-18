"use client";

import { useState } from "react";
import { X, Plus, Mail, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

export function AddCustomerModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddCustomerModalProps) {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = () => {
    setValidationError("");

    if (!email.trim()) {
      setValidationError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    onSubmit(email);
    setEmail("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg border border-border-subtle w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-muted flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-brand" />
            </div>
            <h2 className="font-bold text-foreground text-sm">Add Customer</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground p-1 hover:bg-surface-card rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-xs text-muted">
            Send an invitation to a customer to join your loyalty program.
          </p>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Customer Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError("");
                }}
                placeholder="customer@example.com"
                className={`w-full pl-9 pr-3 py-2 rounded-md bg-surface-card border text-foreground text-sm placeholder-muted focus:outline-none transition-colors ${
                  validationError
                    ? "border-red-500/50 focus:border-red-500/50"
                    : "border-border-subtle focus:border-brand/40"
                }`}
                disabled={isLoading}
              />
            </div>
            {validationError && (
              <p className="text-red-500 text-xs mt-1">{validationError}</p>
            )}
          </div>

          <div className="p-3 bg-brand-muted rounded-md border border-brand/20">
            <p className="text-[10px] text-muted">
              <span className="font-semibold text-foreground">How it works:</span> An
              invitation email will be sent to the customer. They can accept it to join
              your program automatically.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-border-subtle px-4 py-3 flex gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-3 py-2 rounded-md bg-surface border border-border-subtle text-foreground text-xs font-bold hover:bg-surface-card transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !email.trim()}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Send Invitation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
