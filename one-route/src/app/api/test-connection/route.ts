import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Test database connection and retrieve basic statistics
    const userCount = await prisma.user.count();
    const applicationCount = await prisma.application.count();
    const internshipCount = await prisma.internship.count();
    const feedbackCount = await prisma.feedback.count();
    const mentorshipCount = await prisma.mentorship.count();

    // Get sample data for verification
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, email: true, name: true },
      take: 2,
    });

    const recentApplications = await prisma.application.findMany({
      select: {
        id: true,
        status: true,
        appliedDate: true,
        user: { select: { name: true } },
        internship: { select: { title: true, company: true } },
      },
      take: 3,
    });

    return res.status(200).json({
      status: "connected",
      message: "✅ Prisma Client connected successfully!",
      statistics: {
        users: userCount,
        applications: applicationCount,
        internships: internshipCount,
        feedback: feedbackCount,
        mentorships: mentorshipCount,
      },
      sampleData: {
        students,
        recentApplications,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({
      status: "error",
      message: "❌ Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
