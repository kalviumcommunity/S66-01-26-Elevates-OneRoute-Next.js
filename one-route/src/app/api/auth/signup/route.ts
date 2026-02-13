import { sendSuccess } from "@/lib/responseHandler";
import { signupSchema } from "@/lib/schemas/authSchema";
import { prisma } from "@/lib/prisma";
import { handleError, AppError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new AppError(
        "User with this email already exists",
        "DUPLICATE_USER",
        409
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

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

    logger.info("User registered successfully", { userId: newUser.id, email: newUser.email });

    return sendSuccess(
      newUser,
      "User registered successfully",
      201
    );
  } catch (error) {
    return handleError(error, "POST /api/auth/signup");
  }
}
