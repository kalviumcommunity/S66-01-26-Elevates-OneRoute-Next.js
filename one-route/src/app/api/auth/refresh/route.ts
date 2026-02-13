import { sendSuccess } from "@/lib/responseHandler";
import { handleError, AppError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import {
  ACCESS_TOKEN_METADATA,
  CLEAR_REFRESH_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    let refreshToken = getCookieValue(req.headers, REFRESH_TOKEN_COOKIE_NAME);

    if (!refreshToken) {
      try {
        const body = await req.json();
        refreshToken = body?.refreshToken;
      } catch {
        refreshToken = undefined;
      }
    }

    if (!refreshToken) {
      throw new AppError("Refresh token missing", "UNAUTHORIZED", 401);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError("Invalid or expired refresh token", "UNAUTHORIZED", 401);
    }
    const payload = { id: decoded.id, email: decoded.email, role: decoded.role };

    const accessToken = signAccessToken(payload);
    const rotatedRefreshToken = signRefreshToken(payload);
    const accessTokenExpiresAt = new Date(
      Date.now() + ACCESS_TOKEN_METADATA.ttlSeconds * 1000
    ).toISOString();

    logger.info("Access token refreshed", { userId: decoded.id, email: decoded.email });

    const response = sendSuccess(
      {
        token: accessToken,
        expiresIn: ACCESS_TOKEN_METADATA.expiresIn,
        expiresAt: accessTokenExpiresAt,
      },
      "Access token refreshed",
      200
    );

    response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, rotatedRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    const response = handleError(error, "POST /api/auth/refresh");
    response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", CLEAR_REFRESH_TOKEN_COOKIE_OPTIONS);
    return response;
  }
}

function getCookieValue(headers: Headers, name: string) {
  const cookieHeader = headers.get("cookie");
  if (!cookieHeader) {
    return undefined;
  }

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [rawKey, ...rawValue] = cookie.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return undefined;
}
