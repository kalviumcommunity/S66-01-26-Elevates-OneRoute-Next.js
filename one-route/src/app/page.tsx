import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
          <span className="bg-indigo-600 text-white px-2 py-1 rounded">
            🎒
          </span>
          InternLink
        </div>

        <div className="hidden md:flex gap-6 text-sm text-gray-600">
          <Link href="/dashboard" className="hover:text-indigo-600">
            Dashboard
          </Link>
          <Link href="/internships" className="hover:text-indigo-600">
            Internships
          </Link>
          <Link href="/feedback" className="hover:text-indigo-600">
            Feedback
          </Link>
          <Link href="/profile" className="hover:text-indigo-600">
            Profile
          </Link>
        </div>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-indigo-600"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-7xl mx-auto gap-10">
        {/* Left Content */}
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Streamline Your <br /> Internship Journey
          </h1>

          <p className="text-gray-500 mb-6">
            InternLink empowers college students to effortlessly track
            applications, manage deadlines, and receive crucial mentor feedback
            — all in one intuitive platform.
          </p>

          <ul className="space-y-3 text-gray-600 mb-8">
            <li className="flex items-center gap-2">
              ✅ Centralized Application Tracking
            </li>
            <li className="flex items-center gap-2">
              ⏰ Never Miss a Deadline
            </li>
            <li className="flex items-center gap-2">
              💬 Integrated Mentor Feedback
            </li>
          </ul>

          <div className="flex gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition"
            >
              Sign Up Now
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full max-w-md">
          <Image
            src="/hero.jpg"
            alt="Student managing internship applications"
            width={500}
            height={400}
            className="rounded-lg shadow"
            priority
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-400 border-t">
        © 2026 InternLink. All rights reserved.
      </footer>
    </main>
  );
}
