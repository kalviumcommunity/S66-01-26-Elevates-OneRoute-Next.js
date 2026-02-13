"use client";

import { useAuth } from "../hooks/useAuth";
import { useUI } from "../hooks/useUI";


export default function Home() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUI();

  return (
    <div
      className={`p-8 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-8">
        Context & Hooks Demo
      </h1>

      {/* Auth Section */}
      <section className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-4 text-lg">Authentication</h2>

        {isAuthenticated ? (
          <>
            <p className="mb-3">Logged in as: <strong>{user}</strong></p>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => login("InternLinkUser")}
            className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </section>

      {/* UI Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-4 text-lg">UI Controls</h2>

        <p className="mb-4">Current Theme: <strong>{theme}</strong></p>

        <button
          onClick={toggleTheme}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded mr-3"
        >
          Toggle Theme
        </button>

        <button
          onClick={toggleSidebar}
          className="bg-yellow-400 hover:bg-yellow-500 transition text-black px-4 py-2 rounded"
        >
          {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        </button>
      </section>
    </div>
  );
}
