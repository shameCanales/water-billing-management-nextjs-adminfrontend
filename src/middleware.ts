import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Get the token
  const token = request.cookies.get("admin_token")?.value;

  // 2. Define your protected routes (The "Admin Zone")
  const protectedRoutes = [
    "/dashboard",
    "/consumers",
    "/connections",
    "/bills",
    "/settings",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // SCENARIO 1: User is logged in but tries to visit Login page
  // Action: Kick them to Dashboard
  if (request.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // SCENARIO 2: User is NOT logged in but tries to visit a Protected Route
  // Action: Kick them to Login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Update the matcher to include both Login AND your protected routes
export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/consumers/:path*",
    "/connections/:path*",
    "/bills/:path*",
    "/settings/:path*",
  ],
};
