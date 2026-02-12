import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserProfile({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/dashboard">Dashboard</Link> /{" "}
        <Link href="/users">Users</Link> / User {id}
      </nav>

      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>

        <p><strong>ID:</strong> {id}</p>
        <p><strong>Name:</strong> User {id}</p>
        <p><strong>Email:</strong> user{id}@internlink.com</p>
        <p><strong>Role:</strong> Student</p>
      </div>
    </>
  );
}
