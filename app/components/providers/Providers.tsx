"use client";

import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthContext";
import NextSessionProvider from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NextSessionProvider>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </NextSessionProvider>
    </QueryProvider>
  );
}
