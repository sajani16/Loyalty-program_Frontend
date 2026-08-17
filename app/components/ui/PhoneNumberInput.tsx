"use client";

import React, { FC, useState, useMemo, useRef, useEffect } from "react";
import PhoneInput, {
  Value,
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import en from "react-phone-number-input/locale/en.json";

type PhoneNumberInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  id?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

// --- TYPE DEFINITION FOR COUNTRY SELECT PROPS ---
type CustomCountrySelectProps = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options?: any[];
};

const CustomCountrySelect = ({
  value,
  onChange: setCountry,
  disabled,
  options,
}: CustomCountrySelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [localValue, setLocalValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const countries = getCountries();
  const filtered = useMemo(() => {
    return countries.filter(
      (c) =>
        en[c].toLowerCase().includes(search.toLowerCase()) ||
        getCountryCallingCode(c).includes(search),
    );
  }, [search, countries]);

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  return (
    <div className="flex items-center" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 pr-2 h-8 hover:opacity-70 disabled:opacity-50 outline-none"
      >
        <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-gray-100 shrink-0">
          {localValue && (
            <img
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${localValue}.svg`}
              alt={localValue}
            />
          )}
        </span>
        <ChevronsUpDown className="h-3 w-3 text-gray-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-[100] mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden">
          <div className="flex items-center px-3 border-b border-gray-50 bg-white">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              autoFocus
              placeholder="Search country..."
              className="w-full py-3 text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
            {filtered.map((c) => (
              <button
                key={c}
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors text-left"
                onClick={() => {
                  setLocalValue(c);
                  setCountry(c);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <span className="flex h-4 w-6 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                  <img
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${c}.svg`}
                    alt={en[c]}
                  />
                </span>
                <span className="flex-1 truncate">{en[c]}</span>
                <span className="text-gray-400 text-xs">
                  +{getCountryCallingCode(c)}
                </span>
                {localValue === c && (
                  <Check className="h-4 w-4 text-brand ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PhoneNumberInput: FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  placeholder = "Enter phone number",
  disabled = false,
  className,
  error,
  id,
  onKeyDown,
}) => {
  // Trim and sanitize incoming value
  const sanitizedValue = useMemo(() => {
    if (!value) return "";
    let trimmed = value.toString().trim();

    // Ensure it starts with + for E.164 compliance if it looks like a number
    if (trimmed && !trimmed.startsWith("+") && /^\d+$/.test(trimmed)) {
      trimmed = `+${trimmed}`;
    }

    if (trimmed === "+") {
      return "";
    }
    return trimmed;
  }, [value]);

  const [internalValue, setInternalValue] = useState<string | undefined>(
    sanitizedValue || undefined,
  );

  useEffect(() => {
    setInternalValue(sanitizedValue || undefined);
  }, [sanitizedValue]);

  const handlePhoneChange = (val?: string) => {
    setInternalValue(val);
    // Only propagate to parent if it's potentially valid or empty
    // If it's undefined, propagate empty string to avoid form state becoming undefined
    onChange(val || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const start = input.selectionStart || 0;

    if (e.key === "Backspace") {
      const currentVal = internalValue || "";
      const trimmedValue = currentVal.trim();
      const spaceIndex = trimmedValue.indexOf(" ");

      const countryCodeEndIndex = spaceIndex !== -1 ? spaceIndex + 1 : 0;

      if (start <= countryCodeEndIndex) {
        e.preventDefault();
        return;
      }
    }

    // Prevent space from causing reset by not propagating
    if (e.key === " ") {
      e.preventDefault();
      // Manually add space to the value
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const currentVal = internalValue || "";
      const newValue = currentVal.slice(0, start) + " " + currentVal.slice(end);
      setInternalValue(newValue);
      onChange(newValue);
      // Move cursor after the space
      setTimeout(() => {
        input.setSelectionRange(start + 1, start + 1);
      }, 0);
      return;
    }
    // Call the parent's onKeyDown handler if provided
    onKeyDown?.(e);
  };

  return (
    <div className="w-full relative">
      <PhoneInput
        international
        smartCaret={false}
        countryCallingCodeEditable={false}
        defaultCountry="AU"
        value={internalValue as Value}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        disabled={disabled}
        countrySelectComponent={CustomCountrySelect}
        numberInputProps={{
          id: id,
          onKeyDown: handleKeyDown,
          className: cn(
            "flex-1 bg-transparent outline-none border-none focus:ring-0 p-0 h-full w-full text-base placeholder:text-gray-400",
            disabled && "cursor-not-allowed",
          ),
        }}
        className={cn(
          "flex items-center h-12 px-3 bg-transparent transition-all",
          disabled && "opacity-50",
          className,
        )}
      />

      {/* Error rendering removed here to follow common pattern of parent-level error display */}

      <style jsx global>{`
        .react-phone-number-input__country-select {
          display: none !important;
        }
        /* Keep scrollbar minimal but functional */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f1f1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default PhoneNumberInput;
