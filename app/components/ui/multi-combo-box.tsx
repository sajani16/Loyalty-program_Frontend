"use client";

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export interface MultiComboBoxOption {
  id: string;
  label: string;
  value: string;
  image?: string;
}

interface MultiComboBoxProps {
  options: MultiComboBoxOption[];
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MultiComboBox({
  options,
  selected,
  onSelectedChange,
  placeholder = "Select items...",
  maxItems = 3,
  isLoading = false,
  disabled = false,
  className,
}: MultiComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (optionId: string) => {
    if (selected.includes(optionId)) {
      onSelectedChange(selected.filter((id) => id !== optionId));
    } else if (selected.length < maxItems) {
      onSelectedChange([...selected, optionId]);
    }
  };

  const canAddMore = selected.length < maxItems;

  const triggerContent =
    selected.length === 0 ? (
      <span className="text-muted-foreground text-sm">{placeholder}</span>
    ) : (
      <div className="flex gap-1 flex-wrap items-center max-w-[85%]">
        {selected.map((id) => {
          const option = options.find((opt) => opt.id === id);
          return (
            <Badge
              key={id}
              variant="secondary"
              className="text-xs flex items-center gap-1"
            >
              {option?.image && (
                <img
                  src={option.image}
                  alt={option.label}
                  className="h-3 w-3 object-contain"
                />
              )}
              {option?.label}
            </Badge>
          );
        })}
      </div>
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled || isLoading}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          {triggerContent}
          <ChevronDown className="h-4 w-4 opacity-50 ml-auto shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search items..." disabled={isLoading} />
          <CommandEmpty>No items found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.id}
                value={option.id} // value is used for search
                onSelect={() => {
                  handleSelect(option.id);
                  // Don't close on select to allow multiple selections easily
                }}
                disabled={!canAddMore && !selected.includes(option.id)}
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    "mr-2 h-4 w-4 border border-primary rounded flex items-center justify-center flex-shrink-0",
                    selected.includes(option.id) ? "bg-primary" : "opacity-50",
                  )}
                >
                  {selected.includes(option.id) && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.label}
                    className="h-4 w-4 object-contain mr-2"
                  />
                )}
                <span
                  className={
                    selected.includes(option.id) ? "font-semibold" : ""
                  }
                >
                  {option.label}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <div className="border-t p-2 text-xs text-muted-foreground text-center">
            {selected.length}/{maxItems} selected
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
