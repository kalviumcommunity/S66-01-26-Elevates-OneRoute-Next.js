import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-super-secret-key-change-in-production";

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Routes that require authentication
  const protectedRoutes = ["/api/users", "/api/admin"];
  const adminRoutes = ["/api/admin"];

  // Check if the current route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    // Token missing
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid token",
          error: {
            code: "E401",
            type: "UNAUTHORIZED",
          },
        },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

      // Role-based access control for admin routes
      const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
      if (isAdminRoute && decoded.role !== "ADMIN") {
        return NextResponse.json(
          {
            success: false,
            message: "Access denied: Admin privileges required",
            error: {
              code: "E403",
              type: "FORBIDDEN",
            },
          },
          { status: 403 }
        );
      }

      // Attach decoded user info to headers for downstream handlers
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", decoded.id.toString());
      requestHeaders.set("x-user-email", decoded.email);
      requestHeaders.set("x-user-role", decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
          error: {
            code: "E403",
            type: "FORBIDDEN",
          },
        },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/users/:path*", "/api/admin/:path*"],
};
