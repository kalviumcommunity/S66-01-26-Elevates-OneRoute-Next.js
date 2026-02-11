import Link from "next/link";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserProfile({ params }: Props) {
  const { id } = await params;

  const user = {
    id,
    name: `User ${id}`,
    email: `user${id}@internlink.com`,
    role: "Student",
  };

  return (
    <main className="max-w-3xl mx-auto mt-10 px-4">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        {" / "}
        <Link href="/users" className="hover:underline">
          Users
        </Link>
        {" / "}
        <span className="text-gray-700">User {id}</span>
      </nav>

      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      </div>
    </main>
  );
}
