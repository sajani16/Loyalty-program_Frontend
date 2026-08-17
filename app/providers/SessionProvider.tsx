"use client";

import React, { useEffect, useRef } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function SessionExpiryWatcher({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (status !== "authenticated") {
      return;
    }

    const accessTokenExpires = session?.accessTokenExpires;
    if (!accessTokenExpires) {
      return;
    }

    const timeUntilExpiry = accessTokenExpires - Date.now();

    if (timeUntilExpiry <= 0) {
      void signOut({ callbackUrl: "/auth/login" });
      router.replace("/auth/login");
      return;
    }

    timeoutRef.current = setTimeout(() => {
      void signOut({ callbackUrl: "/auth/login" });
      router.replace("/auth/login");
    }, timeUntilExpiry);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [router, session?.accessTokenExpires, status]);

  return <>{children}</>;
}

type sessionProps = {
  children: React.ReactNode;
};
function NextAuthSessionProvider({ children }: sessionProps) {
  return (
    <SessionProvider>
      <SessionExpiryWatcher>{children}</SessionExpiryWatcher>
    </SessionProvider>
  );
}

export default NextAuthSessionProvider;
