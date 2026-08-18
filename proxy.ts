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

export async function proxy(request: NextRequest) {
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

  // ─── Protected routes ───────────────────────────────────────────
  const isProtectedMerchant = pathname.startsWith("/merchant");
  const isProtectedCustomer = pathname.startsWith("/customer");
  const isProtectedLegacy = ["/dashboard", "/plans/checkout"].some((p) =>
    pathname.startsWith(p),
  );

  const isProtected =
    isProtectedMerchant || isProtectedCustomer || isProtectedLegacy;

  // Stripe redirect targets — must stay public
  const isPublicBillingResult =
    pathname.startsWith("/billing/success") ||
    pathname.startsWith("/billing/cancel");

  // ─── Unauthenticated → Login ─────────────────────────────────────
  if (!token && !isPublicBillingResult && isProtected) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);

    // Infer userType from attempted route for a better UX
    if (isProtectedMerchant) {
      loginUrl.searchParams.set("userType", "business");
    } else {
      loginUrl.searchParams.set("userType", "customer");
    }

    return NextResponse.redirect(loginUrl);
  }

  // Safely extract userType from JWT token
  const userType = (token?.user as { userType?: string } | undefined)?.userType;

  // ─── Role-based cross-access guard ───────────────────────────────
  if (token && isProtected) {
    // Merchant trying to access customer routes
    if (isProtectedCustomer && userType === "business") {
      return NextResponse.redirect(
        new URL("/merchant/dashboard", request.url),
      );
    }

    // Customer trying to access merchant routes
    if (isProtectedMerchant && userType === "customer") {
      return NextResponse.redirect(
        new URL("/customer/dashboard", request.url),
      );
    }
  }

  // ─── Logged-in user hitting auth pages ───────────────────────────
  if (token && pathname.startsWith("/auth")) {
    if (sessionExpired) {
      const response = NextResponse.next();
      clearSessionCookies(response);
      return response;
    }
    if (!isPasswordRecovery) {
      // Redirect to appropriate dashboard based on role
      const dashboardUrl =
        userType === "business" ? "/merchant/dashboard" : "/customer/dashboard";
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  return NextResponse.next();
}

// Export default function for Turbopack export matching
export default proxy;

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/billing/:path*",
    "/plans/checkout/:path*",
    "/merchant/:path*",
    "/customer/:path*",
  ],
};