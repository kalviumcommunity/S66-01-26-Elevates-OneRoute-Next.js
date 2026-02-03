import { prisma } from "@/lib/prisma";
import { Role, Status } from "@prisma/client";

/**
 * Example Prisma Queries for One Route
 * Demonstrates type-safe database access with full TypeScript support
 */

// ============================================================================
// USER QUERIES
// ============================================================================

/**
 * Get a student with all their applications and feedback
 * Type-safe: TypeScript knows the exact structure of returned data
 */
export async function getStudentDashboard(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      applications: {
        include: {
          internship: true,
          feedbacks: {
            include: { mentor: { select: { name: true, email: true } } },
          },
          comments: {
            include: { author: { select: { name: true } } },
          },
        },
        orderBy: { appliedDate: "desc" },
      },
      mentoredBy: {
        include: { mentor: { select: { name: true, bio: true, avatar: true } } },
      },
    },
  });
}

/**
 * Get all users with a specific role
 * Demonstrates enum type safety - TypeScript validates Role values
 */
export async function getUsersByRole(role: Role) {
  return prisma.user.findMany({
    where: { role },
    select: {
      id: true,
      email: true,
      name: true,
      bio: true,
      avatar: true,
      createdAt: true,
    },
  });
}

// ============================================================================
// APPLICATION QUERIES
// ============================================================================

/**
 * Get applications filtered by status
 * Status enum is validated by TypeScript at compile-time
 */
export async function getApplicationsByStatus(userId: number, status: Status) {
  return prisma.application.findMany({
    where: { userId, status },
    include: {
      internship: { select: { title: true, company: true, deadline: true } },
      feedbacks: {
        include: { mentor: { select: { name: true } } },
      },
    },
    orderBy: { appliedDate: "desc" },
  });
}

/**
 * Get applications by status count for dashboard
 * Demonstrates aggregation capabilities
 */
export async function getApplicationStatistics(userId: number) {
  const statuses = await prisma.application.groupBy({
    by: ["status"],
    where: { userId },
    _count: { status: true },
  });

  return statuses.reduce(
    (acc, stat) => {
      acc[stat.status.toLowerCase()] = stat._count.status;
      return acc;
    },
    {} as Record<string, number>
  );
}

// ============================================================================
// FEEDBACK QUERIES
// ============================================================================

/**
 * Get all feedback on a specific application
 * Includes mentor information for attribution
 */
export async function getApplicationFeedback(applicationId: number) {
  return prisma.feedback.findMany({
    where: { applicationId },
    include: {
      mentor: {
        select: { id: true, name: true, email: true, bio: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get all feedback given by a mentor
 * Useful for mentor profile/history pages
 */
export async function getMentorFeedbackHistory(mentorId: number) {
  return prisma.feedback.findMany({
    where: { mentorId },
    include: {
      application: {
        include: {
          user: { select: { name: true, email: true } },
          internship: { select: { title: true, company: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ============================================================================
// MENTORSHIP QUERIES
// ============================================================================

/**
 * Get active mentors for a student
 * endDate is null for active mentorships
 */
export async function getStudentMentors(studentId: number) {
  return prisma.mentorship.findMany({
    where: { studentId, endDate: null },
    include: {
      mentor: {
        select: { id: true, name: true, email: true, bio: true, avatar: true },
      },
    },
  });
}

/**
 * Get all students mentored by a mentor
 * Useful for mentor workload tracking
 */
export async function getMentorStudents(mentorId: number) {
  return prisma.mentorship.findMany({
    where: { mentorId, endDate: null },
    include: {
      student: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

// ============================================================================
// INTERNSHIP QUERIES
// ============================================================================

/**
 * Get upcoming internship opportunities
 * Filter by deadline within next 30 days
 */
export async function getUpcomingInternships(daysAhead: number = 30) {
  const now = new Date();
  const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  return prisma.internship.findMany({
    where: {
      deadline: {
        gte: now,
        lte: future,
      },
    },
    orderBy: { deadline: "asc" },
  });
}

/**
 * Get internships by company
 * Case-insensitive search
 */
export async function searchInternshipsByCompany(companyName: string) {
  return prisma.internship.findMany({
    where: {
      company: {
        contains: companyName,
        mode: "insensitive",
      },
    },
    orderBy: { deadline: "asc" },
  });
}

// ============================================================================
// CREATION QUERIES
// ============================================================================

/**
 * Create a new user
 * TypeScript validates role enum value
 */
export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  role: Role;
  bio?: string;
  avatar?: string;
}) {
  return prisma.user.create({ data });
}

/**
 * Create an application for a student
 * Returns error if duplicate (userId, internshipId) exists due to unique constraint
 */
export async function createApplication(data: {
  userId: number;
  internshipId: number;
  notes?: string;
}) {
  return prisma.application.create({
    data: {
      ...data,
      status: Status.APPLIED,
    },
    include: {
      internship: true,
      user: true,
    },
  });
}

/**
 * Add feedback on an application
 * Links mentor to application review
 */
export async function addFeedback(data: {
  applicationId: number;
  mentorId: number;
  content: string;
  rating?: number;
}) {
  return prisma.feedback.create({
    data,
    include: {
      mentor: { select: { name: true } },
      application: { select: { id: true, status: true } },
    },
  });
}

// ============================================================================
// UPDATE QUERIES
// ============================================================================

/**
 * Update application status
 * Demonstrates partial update with validation
 */
export async function updateApplicationStatus(
  applicationId: number,
  status: Status
) {
  const updateData: {
    status: Status;
    interviewDate?: Date;
    offerDate?: Date;
    rejectedDate?: Date;
  } = { status };

  // Set appropriate date based on status
  if (status === Status.INTERVIEW) {
    updateData.interviewDate = new Date();
  } else if (status === Status.OFFER) {
    updateData.offerDate = new Date();
  } else if (status === Status.REJECTED) {
    updateData.rejectedDate = new Date();
  }

  return prisma.application.update({
    where: { id: applicationId },
    data: updateData,
  });
}

// ============================================================================
// DELETION QUERIES (Use with caution)
// ============================================================================

/**
 * Delete an application
 * Cascades to delete associated feedback and comments
 */
export async function deleteApplication(applicationId: number) {
  return prisma.application.delete({
    where: { id: applicationId },
  });
}

/**
 * End a mentorship relationship
 * Sets endDate to current timestamp
 */
export async function endMentorship(mentorshipId: number) {
  return prisma.mentorship.update({
    where: { id: mentorshipId },
    data: { endDate: new Date() },
  });
}
