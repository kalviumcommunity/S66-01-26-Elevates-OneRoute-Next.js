import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

import { checkPermission } from "@/lib/rbac";
import { Permission } from "@/config/roles";

const JWT_SECRET = process.env.JWT_SECRET || "dev-super-secret-key-change-in-production";
const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://localhost:3000",
  process.env.NEXT_PUBLIC_APP_URL || "https://oneroute.app",
];
const ENV_ORIGINS = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];
const ALLOWED_ORIGINS = Array.from(new Set([...DEFAULT_ALLOWED_ORIGINS, ...ENV_ORIGINS])).filter(Boolean);
const ALLOWED_ORIGIN_SET = new Set(ALLOWED_ORIGINS);
const CORS_ALLOW_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const CORS_ALLOW_HEADERS = "Content-Type, Authorization, X-Requested-With";
const CORS_MAX_AGE = "86400"; // 24 hours

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
  const origin = req.headers.get("origin");
  const apiRequest = pathname.startsWith("/api");

  const respondWithCors = (response: NextResponse) => withCors(req, origin, response);

  if (apiRequest && req.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) {
      return NextResponse.json(
        {
          success: false,
          message: "Origin not allowed",
          error: {
            code: "E403",
            type: "FORBIDDEN_ORIGIN",
          },
        },
        { status: 403 }
      );
    }

    const preflight = new NextResponse(null, { status: 204 });
    return respondWithCors(preflight);
  }

  if (apiRequest && origin && !isAllowedOrigin(origin)) {
    return NextResponse.json(
      {
        success: false,
        message: "Origin not allowed",
        error: {
          code: "E403",
          type: "FORBIDDEN_ORIGIN",
        },
      },
      { status: 403 }
    );
  }

  const protectedRoutes = ["/api/users", "/api/admin"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    // Token missing
    if (!token) {
      return respondWithCors(
        NextResponse.json(
          {
            success: false,
            message: "Missing or invalid token",
            error: {
              code: "E401",
              type: "UNAUTHORIZED",
            },
          },
          { status: 401 }
        )
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
          return respondWithCors(
            NextResponse.json(
              {
                success: false,
                message: "Access denied: insufficient permissions",
                error: {
                  code: "E403",
                  type: "FORBIDDEN",
                },
              },
              { status: 403 }
            )
          );
        }
      }

      // Attach decoded user info to headers for downstream handlers
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", decoded.id.toString());
      requestHeaders.set("x-user-email", decoded.email);
      requestHeaders.set("x-user-role", decoded.role);

      const nextResponse = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      return respondWithCors(nextResponse);
    } catch (error) {
      return respondWithCors(
        NextResponse.json(
          {
            success: false,
            message: "Invalid or expired token",
            error: {
              code: "E403",
              type: "FORBIDDEN",
            },
          },
          { status: 403 }
        )
      );
    }
  }

  const response = NextResponse.next();
  return respondWithCors(response);
}

export const config = {
  matcher: ["/api/:path*"],
};

function resolvePermission(pathname: string, method: HttpMethod) {
  const match = routePermissions.find((route) => route.matcher.test(pathname));
  if (!match) {
    return null;
  }
  return match.permissionsByMethod[method] ?? null;
}

function isAllowedOrigin(origin: string | null) {
  if (!origin) {
    return true;
  }
  return ALLOWED_ORIGIN_SET.has(origin);
}

function allowCors(response: NextResponse, origin: string | null) {
  if (!origin || !ALLOWED_ORIGIN_SET.has(origin)) {
    return response;
  }

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", CORS_ALLOW_METHODS);
  response.headers.set("Access-Control-Allow-Headers", CORS_ALLOW_HEADERS);
  response.headers.set("Access-Control-Max-Age", CORS_MAX_AGE);
  response.headers.append("Vary", "Origin");
  return response;
}

function withCors(req: NextRequest, origin: string | null, response: NextResponse) {
  if (!req.nextUrl.pathname.startsWith("/api")) {
    return response;
  }
  return allowCors(response, origin);
}
