import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

import { checkPermission } from "@/lib/rbac";
import { Permission } from "@/config/roles";

const JWT_SECRET = process.env.JWT_SECRET || "dev-super-secret-key-change-in-production";

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

type RoutePermission = {
  matcher: RegExp;
  permissionsByMethod: Partial<Record<HttpMethod, Permission>>;
};

const routePermissions: RoutePermission[] = [
  {
    matcher: /^\/api\/users/, 
    permissionsByMethod: {
      GET: "users.read",
      POST: "users.create",
    },
  },
  {
    matcher: /^\/api\/admin/,
    permissionsByMethod: {
      GET: "admin.access",
      POST: "admin.manage",
    },
  },
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/api/users", "/api/admin"];
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

      const permission = resolvePermission(pathname, req.method as HttpMethod);
      if (permission) {
        const allowed = checkPermission({
          role: decoded.role,
          permission,
          resource: pathname,
          actor: decoded.email,
          source: `middleware:${req.method}`,
        });

        if (!allowed) {
          return NextResponse.json(
            {
              success: false,
              message: "Access denied: insufficient permissions",
              error: {
                code: "E403",
                type: "FORBIDDEN",
              },
            },
            { status: 403 }
          );
        }
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

function resolvePermission(pathname: string, method: HttpMethod) {
  const match = routePermissions.find((route) => route.matcher.test(pathname));
  if (!match) {
    return null;
  }
  return match.permissionsByMethod[method] ?? null;
}
