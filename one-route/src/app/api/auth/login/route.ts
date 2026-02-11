import { sendSuccess } from "@/lib/responseHandler";
import { loginSchema } from "@/lib/schemas/authSchema";
import { prisma } from "@/lib/prisma";
import { handleError, AppError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-super-secret-key-change-in-production";

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

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    logger.info("User logged in", { userId: user.id, email: user.email });

    return sendSuccess(
      {
        token,
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
  } catch (error) {
    return handleError(error, "POST /api/auth/login");
  }
}
