import Link from "next/link";

type UsersPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

type User = {
  id: string;
  name: string;
  role: string;
  location: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getParamValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const shouldSimulateError = (value?: string) =>
  value === "1" || value === "users";

const MOCK_USERS: User[] = [
  { id: "1", name: "Aarav Sharma", role: "Frontend Engineer", location: "Mumbai" },
  { id: "2", name: "Neha Verma", role: "Product Designer", location: "Bengaluru" },
  { id: "3", name: "Rohan Patel", role: "Data Analyst", location: "Pune" },
  { id: "4", name: "Ishita Rao", role: "QA Specialist", location: "Hyderabad" },
];

const fetchUsers = async (simulateError?: string) => {
  await wait(1800);

  if (shouldSimulateError(simulateError)) {
    throw new Error("Failed to load user directory");
  }

  return MOCK_USERS;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const simulateError = getParamValue(searchParams?.simulateError);
  const users = await fetchUsers(simulateError);

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Directory</p>
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <span className="text-sm text-gray-500">{users.length} members</span>
      </div>

      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded shadow"
          >
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">
                {user.role} • {user.location}
              </p>
            </div>

            <Link href={`/users/${user.id}`} className="text-indigo-600 text-sm font-medium">
              View Profile →
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
