import { PrismaClient, Role, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data (order matters due to foreign keys)
  await prisma.comment.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.mentorship.deleteMany();
  await prisma.dashboardStats.deleteMany();
  await prisma.application.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const student1 = await prisma.user.create({
    data: {
      email: "alice@student.com",
      name: "Alice Johnson",
      password: "hashed_password_1", // In production, hash passwords!
      role: Role.STUDENT,
      bio: "Computer Science student interested in backend engineering",
      avatar: "https://api.example.com/avatars/alice.jpg",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "bob@student.com",
      name: "Bob Smith",
      password: "hashed_password_2",
      role: Role.STUDENT,
      bio: "Full-stack developer passionate about web technologies",
      avatar: "https://api.example.com/avatars/bob.jpg",
    },
  });

  const mentor1 = await prisma.user.create({
    data: {
      email: "mentor.sarah@company.com",
      name: "Sarah Chen",
      password: "hashed_password_3",
      role: Role.MENTOR,
      bio: "Senior Software Engineer with 8+ years experience",
      avatar: "https://api.example.com/avatars/sarah.jpg",
    },
  });

  const mentor2 = await prisma.user.create({
    data: {
      email: "mentor.james@company.com",
      name: "James Brown",
      password: "hashed_password_4",
      role: Role.MENTOR,
      bio: "Product Manager focused on user experience and growth",
      avatar: "https://api.example.com/avatars/james.jpg",
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@oneroute.com",
      name: "Admin User",
      password: "hashed_password_5",
      role: Role.ADMIN,
      bio: "Platform administrator",
      avatar: "https://api.example.com/avatars/admin.jpg",
    },
  });

  console.log("✅ Created 5 users (2 students, 2 mentors, 1 admin)");

  // Create internships
  const internship1 = await prisma.internship.create({
    data: {
      title: "Backend Engineer Intern",
      company: "Tech Startup Inc",
      description:
        "Build scalable APIs and work with microservices architecture",
      location: "San Francisco, CA",
      salary: "$25/hr",
      deadline: new Date("2026-03-31"),
      link: "https://example.com/jobs/backend-intern",
      notes: "Requires experience with Node.js and PostgreSQL",
    },
  });

  const internship2 = await prisma.internship.create({
    data: {
      title: "Frontend Engineer Intern",
      company: "Design Studio Co",
      description: "Create beautiful React components and mobile-responsive UIs",
      location: "Remote",
      salary: "$20/hr",
      deadline: new Date("2026-04-15"),
      link: "https://example.com/jobs/frontend-intern",
      notes: "Proficiency in React and Tailwind CSS required",
    },
  });

  const internship3 = await prisma.internship.create({
    data: {
      title: "Full-Stack Developer Intern",
      company: "E-commerce Giants Ltd",
      description:
        "Work on full-stack features for our platform serving millions of users",
      location: "New York, NY",
      salary: "$22/hr",
      deadline: new Date("2026-05-01"),
      link: "https://example.com/jobs/fullstack-intern",
      notes: "Expected to work on both frontend and backend",
    },
  });

  console.log("✅ Created 3 internship opportunities");

  // Create applications
  const app1 = await prisma.application.create({
    data: {
      userId: student1.id,
      internshipId: internship1.id,
      status: Status.INTERVIEW,
      appliedDate: new Date("2026-01-15"),
      interviewDate: new Date("2026-02-10"),
      notes: "First-round technical interview passed",
    },
  });

  await prisma.application.create({
    data: {
      userId: student1.id,
      internshipId: internship2.id,
      status: Status.APPLIED,
      appliedDate: new Date("2026-01-20"),
      notes: "Waiting to hear back from recruiter",
    },
  });

  await prisma.application.create({
    data: {
      userId: student2.id,
      internshipId: internship1.id,
      status: Status.REJECTED,
      appliedDate: new Date("2026-01-10"),
      rejectedDate: new Date("2026-01-25"),
      notes: "Position filled by another candidate",
    },
  });

  const app4 = await prisma.application.create({
    data: {
      userId: student2.id,
      internshipId: internship3.id,
      status: Status.OFFER,
      appliedDate: new Date("2026-01-18"),
      offerDate: new Date("2026-02-01"),
      notes: "Offer received, considering acceptance",
    },
  });

  console.log("✅ Created 4 applications with various statuses");

  // Create feedback
  await prisma.feedback.create({
    data: {
      applicationId: app1.id,
      mentorId: mentor1.id,
      content:
        "Alice demonstrated strong problem-solving skills in the technical assessment. Good communication and asks clarifying questions.",
      rating: 4,
    },
  });

  await prisma.feedback.create({
    data: {
      applicationId: app4.id,
      mentorId: mentor2.id,
      content:
        "Bob showed excellent full-stack capabilities. Ready to contribute from day one.",
      rating: 5,
    },
  });

  console.log("✅ Created 2 feedback entries");

  // Create comments
  await prisma.comment.create({
    data: {
      applicationId: app1.id,
      userId: student1.id,
      content: "Feeling confident after the interview. Looking forward to next steps.",
    },
  });

  await prisma.comment.create({
    data: {
      applicationId: app4.id,
      userId: student2.id,
      content: "Need to decide on the offer by next Friday.",
    },
  });

  console.log("✅ Created 2 comments");

  // Create mentorship relationships
  await prisma.mentorship.create({
    data: {
      studentId: student1.id,
      mentorId: mentor1.id,
      notes: "Focusing on system design and backend optimization",
    },
  });

  await prisma.mentorship.create({
    data: {
      studentId: student2.id,
      mentorId: mentor2.id,
      notes: "Guidance on career growth and product thinking",
    },
  });

  console.log("✅ Created 2 mentorship relationships");

  // Create dashboard stats
  await prisma.dashboardStats.create({
    data: {
      userId: student1.id,
      totalApplications: 2,
      appliedCount: 1,
      interviewCount: 1,
      offersCount: 0,
      rejectedCount: 0,
      mentorsCount: 1,
      feedbackCount: 1,
    },
  });

  await prisma.dashboardStats.create({
    data: {
      userId: student2.id,
      totalApplications: 2,
      appliedCount: 0,
      interviewCount: 0,
      offersCount: 1,
      rejectedCount: 1,
      mentorsCount: 1,
      feedbackCount: 1,
    },
  });

  console.log("✅ Created dashboard stats for students");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\nSummary:");
  console.log(`📊 Users: 5 (2 students, 2 mentors, 1 admin)`);
  console.log(`💼 Internships: 3`);
  console.log(`📝 Applications: 4 (with various statuses)`);
  console.log(`💬 Feedback entries: 2`);
  console.log(`📋 Comments: 2`);
  console.log(`👥 Mentorships: 2`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
