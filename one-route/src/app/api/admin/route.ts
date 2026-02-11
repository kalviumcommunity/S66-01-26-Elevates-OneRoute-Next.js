import { sendSuccess, sendError } from "@/lib/responseHandler";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // User info is attached by middleware in headers
    const userRole = req.headers.get("x-user-role");
    const userEmail = req.headers.get("x-user-email");

    // Double-check role (middleware already checks, but for safety)
    if (userRole !== "ADMIN") {
      return sendError(
        "Access denied: Admin privileges required",
        "FORBIDDEN",
        403
      );
    }

    // Fetch admin statistics
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

    return sendSuccess(
      adminStats,
      "Admin dashboard accessed successfully"
    );
  } catch (error) {
    return sendError(
      "Failed to fetch admin data",
      "INTERNAL_ERROR",
      500,
      error
    );
  }
}

export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role");
    const adminEmail = req.headers.get("x-user-email");

    if (userRole !== "ADMIN") {
      return sendError(
        "Access denied: Admin privileges required",
        "FORBIDDEN",
        403
      );
    }

    const body = await req.json();
    const { userId, newRole } = body;

    // Validate input
    if (!userId || !newRole) {
      return sendError(
        "Missing required fields: userId, newRole",
        "VALIDATION_ERROR",
        400
      );
    }

    // Validate role is one of the allowed roles
    const validRoles = ["STUDENT", "MENTOR", "ADMIN"];
    if (!validRoles.includes(newRole)) {
      return sendError(
        `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        "VALIDATION_ERROR",
        400
      );
    }

    // Update user role
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
      return sendError("User not found", "NOT_FOUND", 404);
    }
    return sendError(
      "Failed to update user role",
      "INTERNAL_ERROR",
      500,
      error
    );
  }
}
