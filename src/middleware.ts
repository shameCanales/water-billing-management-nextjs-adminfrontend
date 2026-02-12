import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function middleware(request: NextRequest) {
  // 1. Get the token
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  // 2. Define your protected routes (The "Admin Zone")
  const protectedRoutes = [
    "/dashboard",
    "/consumers",
    "/connections",
    "/bills",
    "/settings",
    "/staffs",
  ];

  const managerOnlyRoutes = ["/settings", "/staffs"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // SCENARIO 1: User is logged in but tries to visit Login page
  // Action: Kick them to Dashboard
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // SCENARIO 2: User is NOT logged in but tries to visit a Protected Route
  // Action: Kick them to Login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  if (isProtectedRoute && token) {
    try {
      const payload = decodeJwt(token);
      const userRole = payload.role as string; // "manager" | "staff"

      const isRestrictedPath = managerOnlyRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (isRestrictedPath && userRole !== "manager") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (err) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }
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
    "/staffs/:path*",
  ],
};
