"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      Cookies.set("token", "mock.jwt.token");
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
=      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
          <span className="bg-indigo-600 text-white px-2 py-1 rounded">🎒</span>
          InternLink
        </div>

        <div className="flex gap-4 text-sm">
          <Link href="/login" className="text-gray-600 hover:text-indigo-600">
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-1">
            Login to InternLink
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
            >
              Log In
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="#"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-gray-400 border-t">
        © 2026 InternLink. All rights reserved.
      </footer>
    </main>
  );
}
