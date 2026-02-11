import jwt from "jsonwebtoken";

export interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-super-secret-key-change-in-production";

/**
 * Extract and verify JWT token from Authorization header
 * Header format: "Bearer <token>"
 */
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

/**
 * Extract token from Authorization header
 */
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
