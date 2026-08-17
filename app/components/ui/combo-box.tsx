import { useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

/**
 * MultiSelect ComboBox (shadcn UI + Command + Popover)
 * - Supports selecting multiple items
 * - Shows chips for selected items on the trigger (with a compact fallback)
 * - Toggling selection inside the list (click to add/remove)
 *
 * Props:
 * - items: array of items
 * - value: currently selected item ids (string[])
 * - onChange: (ids: string[]) => void
 * - placeholder: string shown when nothing selected
 * - itemToString: (item) => string  // how to render an item label
 * - getId: (item) => string // how to get id from item (default: item.id)
 * - keywords: (item) => string[] // extra searchable tokens (e.g. email)
 * - className: extra class for the trigger button
 * - maxVisibleChips: how many chips to show in the trigger before collapsing to "N selected"
 */

type MultiComboBoxProps<T extends Record<string, any>> = {
  items: T[];
  value?: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  itemToString?: (item: T) => string;
  getId?: (item: T) => string;
  keywords?: (item: T) => string[];
  className?: string;
  maxVisibleChips?: number;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  loading?: boolean;
  multiselect?: boolean;
  disabled?: boolean;
};

const MultiComboBox = <T extends Record<string, any>>({
  items,
  value = [],
  onChange,
  placeholder = "Select...",
  itemToString = (item: any) => (item?.name ?? "") as string,
  getId = (item: any) => String(item?.id ?? ""),
  keywords,
  className,
  maxVisibleChips = 2,
  open,
  setOpen,
  loading,
  multiselect,
  disabled,
}: MultiComboBoxProps<T>) => {
  const selectedItems = useMemo(
    () => items.filter((it) => value.includes(getId(it))),
    [items, value, getId],
  );

  const toggle = (id: string) => {
    const exists = value.includes(id);
    if (multiselect) {
      if (exists) onChange(value.filter((v) => v !== id));
      else onChange([...value, id]);
    } else {
      if (exists) onChange([]);
      else onChange([id]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal h-14", className)}
          disabled={loading || disabled}
        >
          <div className="flex items-center gap-2 truncate w-full">
            {selectedItems.length === 0 && (
              <span className="truncate text-muted-foreground">
                {placeholder}
              </span>
            )}

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2 truncate">
                {multiselect ? (
                  <>
                    {selectedItems.slice(0, maxVisibleChips).map((s) => (
                      <Badge
                        key={getId(s)}
                        variant="secondary"
                        // className="inline-flex items-center gap-1 px-2 py-0.5 text-sm"
                      >
                        {itemToString(s)}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(getId(s));
                          }}
                          aria-label={`Remove ${itemToString(s)}`}
                          className="ml-1"
                        >
                          <X className="h-3 w-3" />
                        </div>
                      </Badge>
                    ))}
                  </>
                ) : (
                  <span className="truncate">
                    {itemToString(selectedItems[0])}
                  </span>
                )}

                {selectedItems.length > maxVisibleChips && (
                  <span className="text-sm opacity-70">
                    +{selectedItems.length - maxVisibleChips}
                  </span>
                )}
              </div>
            )}
          </div>

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="max-w-md p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>

            <CommandGroup>
              {/* <CommandItem
                value={"__clear__"}
                onSelect={() => {
                  clearAll();
                  setOpen(false);
                }}
              >
                Clear selection
              </CommandItem> */}

              {items.map((item) => {
                const id = getId(item);
                const isSelected = value.includes(id);

                return (
                  <CommandItem
                    key={id}
                    value={id}
                    keywords={keywords ? keywords(item) : [itemToString(item)]}
                    onSelect={() => toggle(id)}
                  >
                    {itemToString(item)}
                    <Check
                      className={cn(
                        "ml-auto",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiComboBox;

/**
 * Usage example (brief):
 *
 * <MultiComboBox
 *   items={users}
 *   value={formik.values.assignedTo} // array of _id strings
 *   onChange={(ids) => formik.setFieldValue('assignedTo', ids)}
 *   itemToString={(u) => u.name}
 *   getId={(u) => u._id}
 *   keywords={(u) => [u.name, u.email]}
 *   placeholder="Select users"
 *   maxVisibleChips={2}
 * />
 */
