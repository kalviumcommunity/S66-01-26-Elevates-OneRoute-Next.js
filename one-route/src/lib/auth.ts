import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

export interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload extends DecodedToken {
  tokenId: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-super-secret-key-change-in-production";
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-key-change-in-production";
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
export const REFRESH_TOKEN_COOKIE_NAME =
  process.env.REFRESH_TOKEN_COOKIE_NAME || "one-route.refreshToken";

const ACCESS_TOKEN_TTL_SECONDS = durationToSeconds(ACCESS_TOKEN_EXPIRES_IN, 15 * 60);
const REFRESH_TOKEN_TTL_SECONDS = durationToSeconds(REFRESH_TOKEN_EXPIRES_IN, 7 * 24 * 60 * 60);
const isProd = process.env.NODE_ENV === "production";

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict" as const,
  path: "/",
  maxAge: REFRESH_TOKEN_TTL_SECONDS,
};

export const CLEAR_REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...REFRESH_TOKEN_COOKIE_OPTIONS,
  maxAge: 0,
};

export function signAccessToken(payload: Pick<DecodedToken, "id" | "email" | "role">) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

export function signRefreshToken(payload: Pick<DecodedToken, "id" | "email" | "role">) {
  return jwt.sign({ ...payload, tokenId: randomUUID() }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
}

export function verifyToken(authHeader?: string | null): DecodedToken | null {
  try {
    if (!authHeader) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader?: string | null): string | null {
  try {
    if (!authHeader) {
      return null;
    }
    const token = authHeader.split(" ")[1];
    return token || null;
  } catch {
    return null;
  }
}

export function getAccessTokenExpirySeconds() {
  return ACCESS_TOKEN_TTL_SECONDS;
}

export function getRefreshTokenExpirySeconds() {
  return REFRESH_TOKEN_TTL_SECONDS;
}

function durationToSeconds(value: string | number | undefined, fallback: number) {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (!value || typeof value !== "string") {
    return fallback;
  }

  const match = value.trim().match(/^(\d+)([smhd])$/i);
  if (!match) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  const multiplier = multipliers[unit] ?? 1;
  return amount * multiplier;
}

export const ACCESS_TOKEN_METADATA = {
  ttlSeconds: ACCESS_TOKEN_TTL_SECONDS,
  expiresIn: ACCESS_TOKEN_EXPIRES_IN,
};

export const REFRESH_TOKEN_METADATA = {
  ttlSeconds: REFRESH_TOKEN_TTL_SECONDS,
  expiresIn: REFRESH_TOKEN_EXPIRES_IN,
};
