import { FollowUpItem, StatCard } from "@/app/components";

const DashboardPage = () => {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Overview of Applications
        </h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Applications" value="12" description="You have 12 active applications." />
        <StatCard title="Applied" value="8" description="Waiting for initial response." valueColor="text-blue-600" />
        <StatCard title="Interview" value="3" description="You have 3 upcoming interviews." valueColor="text-teal-600" />
        <StatCard title="Offer" value="1" description="Congratulations! One offer received." valueColor="text-green-600" />
        <StatCard title="Rejected" value="2" description="Learning from experiences." valueColor="text-red-600" />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upcoming Follow-ups
        </h2>

        <div className="bg-white rounded-lg shadow divide-y">
          <FollowUpItem date="2024-07-20" title="Prepare for interview with Google - Software Engineer Intern" badge="High Priority" />
          <FollowUpItem date="2024-07-22" title="Send thank you note to Microsoft recruiter" badge="Medium Priority" />
          <FollowUpItem date="2024-07-25" title="Follow-up with Amazon regarding application status" badge="Low Priority" />
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
