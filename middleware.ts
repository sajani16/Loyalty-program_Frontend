import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const SESSION_COOKIES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "__Host-next-auth.session-token",
];

function clearSessionCookies(response: NextResponse) {
  for (const name of SESSION_COOKIES) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
}

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const sessionExpired =
    request.nextUrl.searchParams.get("reason") === "session_expired";

  const isPasswordRecovery =
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/verify-otp") ||
    pathname.startsWith("/auth/reset-password");

  // Protected pages that require authentication
  const protectedPages = ["/dashboard", "/plans/checkout"];

  // Stripe redirect targets — must stay public (session may not be ready yet)
  const isPublicBillingResult =
    pathname.startsWith("/billing/success") ||
    pathname.startsWith("/billing/cancel");

  // If user is not logged in and tries to access protected pages, redirect to login
  if (
    !token &&
    !isPublicBillingResult &&
    protectedPages.some((page) => pathname.startsWith(page))
  ) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged-in user hitting auth pages — unless session was invalidated client-side
  if (token && pathname.startsWith("/auth")) {
    if (sessionExpired) {
      const response = NextResponse.next();
      clearSessionCookies(response);
      return response;
    }
    if (!isPasswordRecovery) {
      return NextResponse.redirect(new URL("/dashboard/sign-documents", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/billing/:path*",
    "/plans/checkout/:path*",
  ],
};
