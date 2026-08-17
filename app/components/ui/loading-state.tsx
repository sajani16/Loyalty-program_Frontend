import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export default function LoadingState({
  message = "Loading...",
  className,
  size = "md",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 text-muted-foreground",
        className,
      )}
    >
      <Loader2 className={cn("animate-spin", sizeMap[size])} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}