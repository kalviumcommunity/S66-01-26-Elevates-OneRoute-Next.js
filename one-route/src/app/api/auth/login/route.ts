import { sendError, sendSuccess } from "@/lib/responseHandler";
import { loginSchema } from "@/lib/schemas/authSchema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "dev-super-secret-key-change-in-production";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return sendError("User not found", "USER_NOT_FOUND", 404);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return sendError("Invalid credentials", "INVALID_PASSWORD", 401);
    }

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

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
    if (error instanceof ZodError) {
      return sendError(
        "Validation Error",
        "VALIDATION_ERROR",
        400,
        error.issues.map((e) => ({ field: e.path[0], message: e.message }))
      );
    }
    return sendError("Login failed", "INTERNAL_ERROR", 500, error);
  }
}
