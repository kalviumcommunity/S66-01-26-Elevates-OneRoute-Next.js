import { sendError, sendSuccess } from "@/lib/responseHandler";
import { signupSchema } from "@/lib/schemas/authSchema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return sendError(
        "User with this email already exists",
        "DUPLICATE_USER",
        409
      );
    }

    // Hash password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return sendSuccess(
      newUser,
      "User registered successfully",
      201
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
    return sendError("Signup failed", "INTERNAL_ERROR", 500, error);
  }
}
