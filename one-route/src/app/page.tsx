import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
  company?: {
    name: string;
    catchPhrase?: string;
  };
  phone?: string;
};

const DELAY_MS = 1500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchUsers(shouldSimulateError: boolean): Promise<User[]> {
  await wait(DELAY_MS);

  if (shouldSimulateError) {
    throw new Error("Simulated outage for demo purposes. Remove ?simulateError=1 to retry.");
  }

  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load user data");
  }

  return response.json();
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { simulateError?: string };
}) {
  const shouldSimulateError = searchParams?.simulateError === "1";
  const users = await fetchUsers(shouldSimulateError);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Loading & Error Strategy
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Resilient data surfaces keep users informed.
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl">
            User data is fetched on the server. We intentionally add a {DELAY_MS / 1000}
            s delay to show skeletons, and you can append
            {" "}
            <span className="font-semibold text-teal-300">?simulateError=1</span>
            {" "}
            to the URL to trigger the error boundary.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/?"
              className="rounded-full border border-white/20 px-4 py-2 text-white transition hover:border-white/60"
            >
              Normal load
            </Link>
            <Link
              href="/?simulateError=1"
              className="rounded-full border border-rose-400/60 px-4 py-2 text-rose-100 transition hover:border-rose-300 hover:text-white"
            >
              Force error state
            </Link>
          </div>
        </header>

        <section className="grid gap-6 rounded-3xl border border-white/5 bg-white/5 p-10 backdrop-blur-xl sm:grid-cols-2">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </section>
      </main>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-teal-300/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Owner</p>
          <h2 className="text-xl font-semibold text-white">{user.name}</h2>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          Active
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-300">{user.email}</p>
      <p className="text-sm text-slate-400">
        {user.company?.name ?? "Independent"} · {user.company?.catchPhrase ?? "Keeps ops smooth"}
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
        <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
        Available via {user.phone ?? "direct line"}
      </div>
    </article>
  );
}
