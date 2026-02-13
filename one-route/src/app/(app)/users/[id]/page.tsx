import Link from "next/link";

type UserProfilePageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  track: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getParamValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const shouldSimulateError = (value?: string) =>
  value === "1" || value === "user-detail";

const MOCK_USERS: UserProfile[] = [
  { id: "1", name: "Aarav Sharma", email: "aarav@internlink.com", role: "Frontend Engineer", track: "Web Development" },
  { id: "2", name: "Neha Verma", email: "neha@internlink.com", role: "Product Designer", track: "Design Systems" },
  { id: "3", name: "Rohan Patel", email: "rohan@internlink.com", role: "Data Analyst", track: "Analytics" },
  { id: "4", name: "Ishita Rao", email: "ishita@internlink.com", role: "QA Specialist", track: "Quality" },
];

const fetchUserProfile = async (id: string, simulateError?: string) => {
  await wait(1600);

  if (shouldSimulateError(simulateError)) {
    throw new Error("Failed to load user profile");
  }

  const profile = MOCK_USERS.find((user) => user.id === id);

  if (!profile) {
    throw new Error(`User ${id} does not exist`);
  }

  return profile;
};

export default async function UserProfile({ params, searchParams }: UserProfilePageProps) {
  const simulateError = getParamValue(searchParams?.simulateError);
  const profile = await fetchUserProfile(params.id, simulateError);

  return (
    <>
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/dashboard">Dashboard</Link> /{" "}
        <Link href="/users">Users</Link> / {profile.name}
      </nav>

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-xs uppercase tracking-wide text-indigo-600 mb-2">Intern overview</p>
        <h1 className="text-2xl font-bold mb-4">{profile.name}</h1>

        <dl className="space-y-3 text-sm text-gray-700">
          <div>
            <dt className="font-semibold text-gray-900">User ID</dt>
            <dd>{profile.id}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900">Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900">Role</dt>
            <dd>{profile.role}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900">Program Track</dt>
            <dd>{profile.track}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
