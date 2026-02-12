import Link from "next/link";

const users = [
  { id: "1", name: "Aarav Sharma" },
  { id: "2", name: "Neha Verma" },
  { id: "3", name: "Rohan Patel" },
];

export default function UsersPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center p-4 bg-white rounded shadow"
          >
            <span>{user.name}</span>
            <Link href={`/users/${user.id}`} className="text-indigo-600 text-sm">
              View Profile →
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
