import { FollowUpItem, StatCard } from "@/app/components";

type DashboardPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getParamValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const shouldSimulateError = (value?: string) =>
  value === "1" || value === "dashboard";

const fetchDashboardData = async (simulateError?: string) => {
  await wait(1500);

  if (shouldSimulateError(simulateError)) {
    throw new Error("Failed to load dashboard insights");
  }

  return {
    stats: [
      {
        title: "Total Applications",
        value: "12",
        description: "You have 12 active applications.",
      },
      {
        title: "Applied",
        value: "8",
        description: "Waiting for initial response.",
        valueColor: "text-blue-600" as const,
      },
      {
        title: "Interview",
        value: "3",
        description: "You have 3 upcoming interviews.",
        valueColor: "text-teal-600" as const,
      },
      {
        title: "Offer",
        value: "1",
        description: "Congratulations! One offer received.",
        valueColor: "text-green-600" as const,
      },
      {
        title: "Rejected",
        value: "2",
        description: "Learning from experiences.",
        valueColor: "text-red-600" as const,
      },
    ],
    followUps: [
      {
        date: "2024-07-20",
        title: "Prepare for interview with Google - Software Engineer Intern",
        badge: "High Priority",
      },
      {
        date: "2024-07-22",
        title: "Send thank you note to Microsoft recruiter",
        badge: "Medium Priority",
      },
      {
        date: "2024-07-25",
        title: "Follow-up with Amazon regarding application status",
        badge: "Low Priority",
      },
    ],
  };
};

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const simulateError = getParamValue(searchParams?.simulateError);
  const { stats, followUps } = await fetchDashboardData(simulateError);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Overview of Applications
        </h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upcoming Follow-ups
        </h2>

        <div className="bg-white rounded-lg shadow divide-y">
          {followUps.map((followUp) => (
            <FollowUpItem key={`${followUp.date}-${followUp.title}`} {...followUp} />
          ))}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
