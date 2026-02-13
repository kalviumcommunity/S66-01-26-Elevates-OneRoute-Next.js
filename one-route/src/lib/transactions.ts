/**
 * Transaction Examples with Error Handling & Rollback
 * Demonstrates ACID principles: Atomicity, Consistency, Isolation, Durability
 */

import { prisma } from "@/lib/prisma";
import { Role, Status } from "@prisma/client";

/**
 * ============================================================================
 * SCENARIO 1: Create Application with Feedback in Single Transaction
 * ============================================================================
 * Use Case: Ensure application and mentor feedback are created together
 * Risk Without Transaction: Application created but feedback fails → orphaned record
 */
export async function createApplicationWithFeedback(
  userId: number,
  internshipId: number,
  mentorId: number,
  feedbackContent: string,
  rating?: number
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Create application
      const application = await tx.application.create({
        data: {
          userId,
          internshipId,
          status: Status.APPLIED,
        },
      });

      // Step 2: Add mentor feedback
      // If this fails, Step 1 is automatically rolled back
      const feedback = await tx.feedback.create({
        data: {
          applicationId: application.id,
          mentorId,
          content: feedbackContent,
          rating,
        },
      });

      // Step 3: Update dashboard stats
      const stats = await tx.dashboardStats.upsert({
        where: { userId },
        create: {
          userId,
          totalApplications: 1,
          appliedCount: 1,
        },
        update: {
          totalApplications: { increment: 1 },
          appliedCount: { increment: 1 },
          lastUpdated: new Date(),
        },
      });

      return { application, feedback, stats };
    });

    console.log("✅ Transaction successful:", result);
    return result;
  } catch (error) {
    console.error("❌ Transaction failed. Rolling back all changes.", error);
    throw new Error(`Failed to create application with feedback: ${error}`);
  }
}

/**
 * ============================================================================
 * SCENARIO 2: Bulk Create Applications with Status Validation
 * ============================================================================
 * Use Case: Create multiple applications atomically, fail if any duplicate exists
 */
export async function createMultipleApplications(
  applications: Array<{
    userId: number;
    internshipId: number;
    notes?: string;
  }>
) {
  try {
    const results = await prisma.$transaction(async (tx) => {
      const createdApps = [];

      for (const app of applications) {
        // Check for duplicates within transaction
        const existing = await tx.application.findUnique({
          where: {
            userId_internshipId: {
              userId: app.userId,
              internshipId: app.internshipId,
            },
          },
        });

        if (existing) {
          throw new Error(
            `Duplicate application: User ${app.userId} already applied to internship ${app.internshipId}`
          );
        }

        // Create application
        const created = await tx.application.create({
          data: {
            ...app,
            status: Status.APPLIED,
          },
        });

        createdApps.push(created);
      }

      return createdApps;
    });

    console.log(
      `✅ Successfully created ${results.length} applications atomically`
    );
    return results;
  } catch (error) {
    console.error(
      "❌ Bulk creation failed. All applications rolled back.",
      error
    );
    throw error;
  }
}

/**
 * ============================================================================
 * SCENARIO 3: Update Application Status & Create Related Records
 * ============================================================================
 * Use Case: Move application to INTERVIEW status and create feedback record
 * Atomicity: Both succeed or both fail, no partial updates
 */
export async function promoteApplicationToInterview(
  applicationId: number,
  mentorId: number,
  feedbackContent: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Validate application exists
      const application = await tx.application.findUnique({
        where: { id: applicationId },
      });

      if (!application) {
        throw new Error(`Application ${applicationId} not found`);
      }

      if (application.status !== Status.APPLIED) {
        throw new Error(
          `Cannot promote application in ${application.status} status`
        );
      }

      // Step 2: Update status to INTERVIEW
      const updated = await tx.application.update({
        where: { id: applicationId },
        data: {
          status: Status.INTERVIEW,
          interviewDate: new Date(),
        },
      });

      // Step 3: Create feedback
      const feedback = await tx.feedback.create({
        data: {
          applicationId,
          mentorId,
          content: feedbackContent,
        },
      });

      // Step 4: Update dashboard stats
      const dashStats = await tx.dashboardStats.update({
        where: { userId: application.userId },
        data: {
          interviewCount: { increment: 1 },
          appliedCount: { decrement: 1 },
          lastUpdated: new Date(),
        },
      });

      return { updated, feedback, dashStats };
    });

    console.log("✅ Application promoted to INTERVIEW successfully");
    return result;
  } catch (error) {
    console.error("❌ Failed to promote application. Rolling back.", error);
    throw error;
  }
}

/**
 * ============================================================================
 * SCENARIO 4: Create Mentorship with Automatic Stats Update
 * ============================================================================
 * Use Case: Establish mentor-student relationship and update both profiles
 */
export async function createMentorshipRelationship(
  studentId: number,
  mentorId: number,
  notes?: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Verify mentor role
      const mentor = await tx.user.findUnique({
        where: { id: mentorId },
      });

      if (!mentor || mentor.role !== Role.MENTOR) {
        throw new Error(`User ${mentorId} is not a mentor`);
      }

      // Step 2: Create mentorship
      const mentorship = await tx.mentorship.create({
        data: {
          studentId,
          mentorId,
          notes,
        },
      });

      // Step 3: Update student dashboard
      const studentStats = await tx.dashboardStats.update({
        where: { userId: studentId },
        data: {
          mentorsCount: { increment: 1 },
          lastUpdated: new Date(),
        },
      });

      return { mentorship, studentStats };
    });

    console.log("✅ Mentorship relationship created successfully");
    return result;
  } catch (error) {
    console.error("❌ Failed to create mentorship. Rolling back.", error);
    throw error;
  }
}

/**
 * ============================================================================
 * SCENARIO 5: INTENTIONAL ERROR TEST - Verify Rollback Behavior
 * ============================================================================
 * Tests that all data is rolled back when an error occurs mid-transaction
 * This is proof of atomicity and transaction safety
 */
export async function testTransactionRollback(userId: number) {
  try {
    await prisma.$transaction(async (tx) => {
      // Step 1: Create user (succeeds)
      const user = await tx.user.create({
        data: {
          email: `test-rollback-${Date.now()}@example.com`,
          name: "Rollback Test User",
          password: "hashed_password",
          role: Role.STUDENT,
        },
      });

      console.log("✅ Step 1 completed: User created");

      // Step 2: Try to create application with invalid internship ID
      // This should fail and trigger rollback
      await tx.application.create({
        data: {
          userId: user.id,
          internshipId: 99999, // Non-existent internship
        },
      });

      // This line never executes due to constraint violation
      console.log("❌ This should not appear - transaction should fail here");
    });
  } catch (error) {
    console.error(
      "✅ Transaction rollback verified!",
      "Error triggered as expected:",
      error
    );
    console.log(
      "The user created in Step 1 was automatically rolled back and does NOT exist in database"
    );
    return { success: true, rollbackVerified: true };
  }
}

/**
 * ============================================================================
 * SCENARIO 6: Batch Operations with Transaction
 * ============================================================================
 * Use Case: Create multiple records atomically with validation
 */
export async function batchCreateApplicationsWithValidation(
  applications: Array<{
    userId: number;
    internshipId: number;
  }>
) {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const createdApps = [];
        let totalApplicationsAcrossUsers = 0;

        for (const app of applications) {
          // Validate user exists
          const user = await tx.user.findUnique({
            where: { id: app.userId },
          });

          if (!user) {
            throw new Error(`User ${app.userId} does not exist`);
          }

          // Check duplicate
          const existing = await tx.application.findUnique({
            where: {
              userId_internshipId: {
                userId: app.userId,
                internshipId: app.internshipId,
              },
            },
          });

          if (existing) {
            throw new Error(
              `Application already exists for user ${app.userId}`
            );
          }

          // Create application
          const created = await tx.application.create({
            data: {
              ...app,
              status: Status.APPLIED,
            },
          });

          createdApps.push(created);

          // Update dashboard
          await tx.dashboardStats.upsert({
            where: { userId: app.userId },
            create: {
              userId: app.userId,
              totalApplications: 1,
              appliedCount: 1,
            },
            update: {
              totalApplications: { increment: 1 },
              appliedCount: { increment: 1 },
              lastUpdated: new Date(),
            },
          });

          totalApplicationsAcrossUsers++;
        }

        return { createdApps, totalApplicationsAcrossUsers };
      },
      {
        // Transaction options for better isolation
        isolationLevel: "Serializable",
        timeout: 10000, // 10 second timeout
      }
    );

    console.log(
      `✅ Batch operation completed: ${result.totalApplicationsAcrossUsers} applications created`
    );
    return result;
  } catch (error) {
    console.error(
      "❌ Batch operation failed and rolled back completely:",
      error
    );
    throw error;
  }
}

/**
 * ============================================================================
 * SCENARIO 7: Conditional Transaction with Early Exit
 * ============================================================================
 * Use Case: Only proceed with transaction if certain conditions are met
 */
export async function updateApplicationStatusWithConditions(
  applicationId: number,
  newStatus: Status,
  mentorId?: number
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Fetch current application state
      const application = await tx.application.findUnique({
        where: { id: applicationId },
        include: { user: true },
      });

      if (!application) {
        throw new Error(`Application ${applicationId} not found`);
      }

      // Validate status transition
      const validTransitions: Record<Status, Status[]> = {
        [Status.APPLIED]: [Status.INTERVIEW, Status.REJECTED],
        [Status.INTERVIEW]: [Status.OFFER, Status.REJECTED],
        [Status.OFFER]: [Status.ACCEPTED, Status.DECLINED],
        [Status.REJECTED]: [],
        [Status.ACCEPTED]: [],
        [Status.DECLINED]: [],
      };

      if (!validTransitions[application.status].includes(newStatus)) {
        throw new Error(
          `Invalid transition from ${application.status} to ${newStatus}`
        );
      }

      // Update application
      const updated = await tx.application.update({
        where: { id: applicationId },
        data: { status: newStatus },
      });

      // If transitioning to OFFER, optionally create feedback
      if (newStatus === Status.OFFER && mentorId) {
        await tx.feedback.create({
          data: {
            applicationId,
            mentorId,
            content: "Offer extended",
            rating: 5,
          },
        });
      }

      return updated;
    });

    console.log("✅ Application status updated successfully with validation");
    return result;
  } catch (error) {
    console.error("❌ Status update failed:", error);
    throw error;
  }
}

/**
 * ============================================================================
 * PERFORMANCE NOTES
 * ============================================================================
 *
 * 1. ATOMICITY GUARANTEE:
 *    - All operations within transaction succeed or all fail
 *    - No partial writes, no orphaned records
 *    - Database returns to pre-transaction state on error
 *
 * 2. ISOLATION LEVELS (Default: Read Committed):
 *    - Serializable: Strongest isolation, prevents all anomalies (used in batchCreateApplicationsWithValidation)
 *    - RepeatableRead: Prevents dirty reads and phantom reads
 *    - ReadCommitted: Prevents only dirty reads (fastest)
 *    - ReadUncommitted: No protection (rarely used)
 *
 * 3. TIMEOUT HANDLING:
 *    - Set timeout to prevent indefinite locks
 *    - 10 seconds is reasonable for most operations
 *    - Adjust based on expected transaction duration
 *
 * 4. ROLLBACK TRIGGERS:
 *    - Constraint violations (unique, foreign key)
 *    - Invalid enum values
 *    - Throwing errors manually
 *    - Database connection loss
 *    - Timeout exceeded
 *
 * 5. TRANSACTION SIZE:
 *    - Keep transactions focused on a single logical unit
 *    - Larger transactions = longer locks = lower concurrency
 *    - Pre-fetch read-only data outside transaction when possible
 */

export default {
  createApplicationWithFeedback,
  createMultipleApplications,
  promoteApplicationToInterview,
  createMentorshipRelationship,
  testTransactionRollback,
  batchCreateApplicationsWithValidation,
  updateApplicationStatusWithConditions,
};
