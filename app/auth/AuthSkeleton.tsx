import { Skeleton } from "@/components/ui/skeleton";

export default function AuthSkeleton() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="p-6 sm:p-8">
        <div className="text-center">
          <Skeleton className="mx-auto mb-3 h-12 w-48" />
          <Skeleton className="mx-auto h-4 w-64" />
        </div>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>

          <Skeleton className="h-11 w-full" />

          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <Skeleton className="mx-auto h-4 w-48" />
      </div>
    </div>
  );
}
