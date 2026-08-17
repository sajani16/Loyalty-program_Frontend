"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { IndustryOption } from "@/services/industry.service";

interface IndustryDropdownProps {
  value: string;
  options: Array<string | { label: string; value: string } | IndustryOption>;
  // 1. UPDATE: Pass both the ID and the raw option item back to the parent component
  onChange: (val: string, fullOption: any) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const getOptionValue = (
  option: string | { label: string; value: string } | IndustryOption,
) => {
  if (typeof option === "string") return option;
  if ("value" in option) return option.value;
  if ("_id" in option) return option._id;
  return (option as any).value ?? String(option);
};

const getOptionLabel = (
  option: string | { label: string; value: string } | IndustryOption,
) => {
  if (typeof option === "string") return option;
  if ("label" in option) return option.label;
  if ("name" in option) return option.name;
  return String((option as any)._id ?? (option as any).value ?? option);
};

export default function IndustryDropdown({
  value,
  options,
  onChange,
  placeholder = "Select your industry",
  className,
  disabled,
}: IndustryDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && value && listRef.current) {
      const active = listRef.current.querySelector(
        "[data-active='true']",
      ) as HTMLElement;
      active?.scrollIntoView({ block: "nearest" });
    }
  }, [open, value]);

  // 2. UPDATE: Find the full matching item configuration and return it up
  const select = (optValue: string, originalOption: any) => {
    onChange(optValue, originalOption); 
    setOpen(false);
  };

  const selectedOption = options.find((opt) => getOptionValue(opt) === value);
  const displayLabel = selectedOption ? getOptionLabel(selectedOption) : "";

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between transition-colors duration-200 outline-none text-left disabled:opacity-50 ${
          className
            ? className + " pr-3"
            : "border-b-2 py-3 text-lg bg-transparent px-0.5"
        }`}
        style={{
          borderColor: className ? undefined : open ? "#0f2d52" : "#e8e0e0",
        }}
      >
        <span
          style={{ color: value ? "#1a1a1a" : "#999" }}
          className="truncate flex-1"
        >
          {value ? displayLabel : placeholder}
        </span>
        <div className="flex-shrink-0 ml-2">
          {open ? (
            <ChevronUp className="w-4 h-4" style={{ color: "#0f2d52" }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: "#bbb" }} />
          )}
        </div>
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 top-full mt-1 z-50 overflow-y-auto rounded-xl bg-white"
          style={{
            maxHeight: "260px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            border: "1px solid #f0e8e8",
          }}
        >
          {options.map((opt, index) => {
            const optionValue = getOptionValue(opt);
            const optionLabel = getOptionLabel(opt);
            const active = optionValue === value;
            return (
              <button
                key={`${optionValue}-${index}`}
                type="button"
                data-active={active}
                // 3. UPDATE: Pass along the current 'opt' structure loop item
                onClick={() => select(optionValue, opt)}
                className="w-full text-left px-4 py-3 text-sm transition-colors"
                style={{
                  color: active ? "#0f2d52" : "#333",
                  fontWeight: active ? 600 : 400,
                  backgroundColor: active ? "#fdf5f5" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.backgroundColor = "#fafafa";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {optionLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}