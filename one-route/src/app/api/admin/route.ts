import { sendSuccess } from "@/lib/responseHandler";
import { prisma } from "@/lib/prisma";
import { handleError, AppError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role");
    const userEmail = req.headers.get("x-user-email");

    if (userRole !== "ADMIN") {
      throw new AppError(
        "Access denied: Admin privileges required",
        "FORBIDDEN",
        403
      );
    }

    const totalUsers = await prisma.user.count();
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: true,
    });

    const adminStats = {
      totalUsers,
      usersByRole: usersByRole.map((ur) => ({
        role: ur.role,
        count: ur._count,
      })),
      lastAdminAction: {
        admin: userEmail,
        timestamp: new Date(),
        action: "Viewed admin dashboard",
      },
    };

    logger.info("Admin dashboard accessed", { adminEmail, stats: adminStats });

    return sendSuccess(
      adminStats,
      "Admin dashboard accessed successfully"
    );
  } catch (error) {
    return handleError(error, "GET /api/admin");
  }
}

export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role");
    const adminEmail = req.headers.get("x-user-email");

    if (userRole !== "ADMIN") {
      throw new AppError(
        "Access denied: Admin privileges required",
        "FORBIDDEN",
        403
      );
    }

    const body = await req.json();
    const { userId, newRole } = body;

    if (!userId || !newRole) {
      throw new AppError(
        "Missing required fields: userId, newRole",
        "VALIDATION_ERROR",
        400
      );
    }

    const validRoles = ["STUDENT", "MENTOR", "ADMIN"];
    if (!validRoles.includes(newRole)) {
      throw new AppError(
        `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        "VALIDATION_ERROR",
        400
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    logger.info("User role updated", {
      adminEmail,
      userId: updatedUser.id,
      newRole: updatedUser.role,
    });

    return sendSuccess(
      {
        user: updatedUser,
        changedBy: adminEmail,
        timestamp: new Date(),
      },
      "User role updated successfully"
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return handleError(
        new AppError("User not found", "NOT_FOUND", 404),
        "POST /api/admin"
      );
    }
    return handleError(error, "POST /api/admin");
  }
}
