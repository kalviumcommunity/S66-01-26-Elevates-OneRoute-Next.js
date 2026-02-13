"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  Bell,
  Menu,
  LogOut,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";
import { useUIContext } from "@/app/context/UIContext";

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function Header({
  onMenuClick,
  showMenuButton = false,
}: HeaderProps) {
  const { theme, toggleTheme } = useUIContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock auth state - replace with your actual auth
  const [user] = useState({ name: "User", email: "user@example.com" });
  const isAuthenticated = !!user;

  const notifications = [
    {
      id: 1,
      title: "New application status",
      message: "Google updated your application",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Interview reminder",
      message: "Meta interview tomorrow at 10 AM",
      time: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      title: "Offer received",
      message: "Amazon sent you an offer",
      time: "1 day ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        theme === "dark"
          ? "bg-slate-900/80 border-slate-800"
          : "bg-white/80 border-slate-200"
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className={`lg:hidden p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
                }`}
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 group-hover:scale-110 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50"
                    : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30"
                }`}
              >
                OR
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                OneRoute
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 ${
                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                      theme === "dark"
                        ? "hover:bg-slate-800"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      <div
                        className={`absolute right-0 mt-2 w-80 rounded-2xl border backdrop-blur-xl shadow-2xl z-50 ${
                          theme === "dark"
                            ? "bg-slate-800/95 border-slate-700"
                            : "bg-white/95 border-slate-200"
                        }`}
                      >
                        <div
                          className={`p-4 border-b ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold">Notifications</h3>
                            {unreadCount > 0 && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-violet-500/20 text-violet-600">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                                theme === "dark"
                                  ? "border-slate-700"
                                  : "border-slate-200"
                              } ${
                                notif.unread
                                  ? "bg-violet-50/50 dark:bg-violet-500/5"
                                  : ""
                              }`}
                            >
                              <div className="flex gap-3">
                                {notif.unread && (
                                  <div className="w-2 h-2 bg-violet-600 rounded-full mt-2 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm mb-1">
                                    {notif.title}
                                  </p>
                                  <p
                                    className={`text-sm mb-1 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
                                  >
                                    {notif.message}
                                  </p>
                                  <p
                                    className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}
                                  >
                                    {notif.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div
                          className={`p-3 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`}
                        >
                          <button className="w-full text-sm font-medium text-violet-600 hover:text-fuchsia-600 transition-colors">
                            View all notifications
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                      theme === "dark"
                        ? "hover:bg-slate-800"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm text-white ${
                        theme === "dark"
                          ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                          : "bg-gradient-to-br from-violet-600 to-fuchsia-600"
                      }`}
                    >
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="hidden md:block font-medium">
                      {user?.name || "User"}
                    </span>
                    <ChevronDown className="hidden md:block w-4 h-4" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div
                        className={`absolute right-0 mt-2 w-56 rounded-2xl border backdrop-blur-xl shadow-2xl z-50 ${
                          theme === "dark"
                            ? "bg-slate-800/95 border-slate-700"
                            : "bg-white/95 border-slate-200"
                        }`}
                      >
                        <div
                          className={`p-4 border-b ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`}
                        >
                          <p className="font-semibold">
                            {user?.name || "User"}
                          </p>
                          <p
                            className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
                          >
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/profile"
                            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                              theme === "dark"
                                ? "hover:bg-slate-700"
                                : "hover:bg-slate-100"
                            }`}
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="w-5 h-5" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/settings"
                            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                              theme === "dark"
                                ? "hover:bg-slate-700"
                                : "hover:bg-slate-100"
                            }`}
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                          </Link>
                        </div>
                        <div
                          className={`p-2 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`}
                        >
                          <button
                            onClick={() => {
                              // Add your logout logic here
                              setShowUserMenu(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={`hidden sm:block px-5 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                    theme === "dark"
                      ? "text-white hover:bg-slate-800"
                      : "text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
