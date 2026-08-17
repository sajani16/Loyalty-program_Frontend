import LoadingState from "@/components/ui/loading-state";

interface TableSkeletonProps {
  message?: string;
}

export function TableSkeleton({ message = "Loading..." }: TableSkeletonProps) {
  return <LoadingState message={message} className="py-8" />;
}