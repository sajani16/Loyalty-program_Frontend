import { Loader2, Download } from "lucide-react";

interface ExportLoadingProps {
  message?: string;
}

export default function ExportLoading({
  message = "Exporting data...",
}: ExportLoadingProps) {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Download className="h-12 w-12 text-primary/30" />
          <Loader2 className="absolute inset-0 h-12 w-12 animate-spin text-primary" />
        </div>
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm text-muted-foreground">
          This may take a few moments...
        </p>
      </div>
    </div>
  );
}