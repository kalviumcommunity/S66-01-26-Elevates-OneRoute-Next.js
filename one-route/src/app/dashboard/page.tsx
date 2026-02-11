import React from "react";

const DashboardPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Overview of Applications
        </h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Applications"
          value="12"
          description="You have 12 active applications."
        />
        <StatCard
          title="Applied"
          value="8"
          description="Waiting for initial response."
          valueColor="text-blue-600"
        />
        <StatCard
          title="Interview"
          value="3"
          description="You have 3 upcoming interviews."
          valueColor="text-teal-600"
        />
        <StatCard
          title="Offer"
          value="1"
          description="Congratulations! One offer received."
          valueColor="text-green-600"
        />
        <StatCard
          title="Rejected"
          value="2"
          description="Learning from experiences."
          valueColor="text-red-600"
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upcoming Follow-ups
        </h2>

        <div className="bg-white rounded-lg shadow divide-y">
          <FollowUpItem
            date="2024-07-20"
            title="Prepare for interview with Google - Software Engineer Intern"
            badge="High Priority"
          />
          <FollowUpItem
            date="2024-07-22"
            title="Send thank you note to Microsoft recruiter"
            badge="Medium Priority"
          />
          <FollowUpItem
            date="2024-07-25"
            title="Follow-up with Amazon regarding application status"
            badge="Low Priority"
          />
          <FollowUpItem
            date="2024-07-28"
            title="Mentor session with Dr. Smith"
            badge="Scheduled"
          />
          <FollowUpItem
            date="2024-08-01"
            title="Review LinkedIn profile for new opportunities"
            badge="General Task"
          />
        </div>
      </section>

      <footer className="mt-16 text-center text-sm text-gray-400">
        © 2026 InternLink. All rights reserved.
      </footer>
    </main>
  );
};

export default DashboardPage;

/* ---------- Components ---------- */

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  valueColor?: string;
}

const StatCard = ({
  title,
  value,
  description,
  valueColor = "text-gray-900",
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-sm text-gray-400 mt-2">{description}</p>
    </div>
  );
};

interface FollowUpItemProps {
  date: string;
  title: string;
  badge: string;
}

const FollowUpItem = ({ date, title, badge }: FollowUpItemProps) => {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex gap-6">
        <span className="text-sm text-gray-500 w-24">{date}</span>
        <span className="text-sm text-gray-800">{title}</span>
      </div>
      <span className="text-xs px-3 py-1 rounded-full border text-gray-600">
        {badge}
      </span>
    </div>
  );
};
