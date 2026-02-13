import { sendSuccess } from "@/lib/responseHandler";
import { loginSchema } from "@/lib/schemas/authSchema";
import { prisma } from "@/lib/prisma";
import { handleError, AppError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  signAccessToken,
  signRefreshToken,
  ACCESS_TOKEN_METADATA,
  REFRESH_TOKEN_METADATA,
} from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      throw new AppError(
        "User not found",
        "USER_NOT_FOUND",
        404
      );
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      logger.warn("Failed login attempt", { email: validatedData.email });
      throw new AppError(
        "Invalid credentials",
        "INVALID_PASSWORD",
        401
      );
    }

    const basePayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(basePayload);
    const refreshToken = signRefreshToken(basePayload);
    const accessTokenExpiresAt = new Date(
      Date.now() + ACCESS_TOKEN_METADATA.ttlSeconds * 1000
    ).toISOString();

    logger.info("User logged in", { userId: user.id, email: user.email });

    const response = sendSuccess(
      {
        token: accessToken,
        expiresIn: ACCESS_TOKEN_METADATA.expiresIn,
        expiresAt: accessTokenExpiresAt,
        refreshTokenExpiresIn: REFRESH_TOKEN_METADATA.expiresIn,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful",
      200
    );

    response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    return handleError(error, "POST /api/auth/login");
  }
}
