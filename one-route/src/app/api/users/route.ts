import { sendSuccess } from "@/lib/responseHandler";
import { userSchema, UserInput } from "@/lib/schemas/userSchema";
import { verifyToken } from "@/lib/auth";
import { handleError, AppError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import { enforcePermission } from "@/lib/rbac";
import redis from "@/lib/redis";
import { sanitizePayload } from "@/lib/security/sanitizer";

type User = UserInput & {
  id: number;
};

const USERS: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 28 },
  { id: 4, name: 'Diana', email: 'diana@example.com', age: 22 },
];

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const decoded = verifyToken(authHeader);

    if (!decoded) {
      throw new AppError("Missing or invalid token", "UNAUTHORIZED", 401);
    }

    enforcePermission({
      role: decoded.role,
      permission: "users.read",
      resource: "/api/users",
      actor: decoded.email,
      source: "GET /api/users",
    });

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const cacheKey = `users:list:page:${page}:limit:${limit}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      logger.info("Cache hit for users list", { userEmail: decoded.email, page, limit, cacheKey });
      return sendSuccess(
        JSON.parse(cachedData),
        "Users fetched from cache"
      );
    }

    const start = (page - 1) * limit;
    const data = USERS.slice(start, start + limit);
    const response = {
      page,
      limit,
      total: USERS.length,
      data,
      requestedBy: decoded.email,
    };

    await redis.set(cacheKey, JSON.stringify(response), 'EX', 300);

    logger.info("Cache miss for users list - fetched from database", { userEmail: decoded.email, page, limit, cacheKey });

    return sendSuccess(response, "Users fetched successfully");
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const decoded = verifyToken(authHeader);

    if (!decoded) {
      throw new AppError("Missing or invalid token", "UNAUTHORIZED", 401);
    }

    enforcePermission({
      role: decoded.role,
      permission: "users.create",
      resource: "/api/users",
      actor: decoded.email,
      source: "POST /api/users",
    }, "Access denied: only admins can add users");

    const body = await req.json();
    const sanitizedBody = sanitizePayload(body);
    const validatedData = userSchema.parse(sanitizedBody);

    const newUser: User = {
      id: Date.now(),
      ...validatedData,
    };

    USERS.push(newUser);

    await redis.del("users:list:*");

    logger.info("User created and cache invalidated", { userId: newUser.id, email: newUser.email });

    return sendSuccess(newUser, "User created successfully", 201);
  } catch (error) {
    return handleError(error, "POST /api/users");
  }
}
