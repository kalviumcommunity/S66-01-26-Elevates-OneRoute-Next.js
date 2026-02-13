"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Mail,
  X,
  ChevronRight,
} from "lucide-react";
import { useUIContext } from "@/app/context/UIContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    name: "Applications",
    href: "/applications",
    icon: Briefcase,
    description: "Track your apps",
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    description: "Manage users",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Insights & reports",
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
    description: "Resumes & files",
  },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useUIContext();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen transition-all duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    border-r flex flex-col w-72
    bg-white text-slate-900
    dark:bg-slate-900 dark:text-slate-100
    dark:border-slate-800 border-slate-200
  `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                theme === "dark"
                  ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50"
                  : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30"
              }`}
            >
              OR
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              OneRoute
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
              theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Primary Navigation */}
          <div className="mb-6">
            <p
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Main Menu
            </p>
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg scale-105"
                      : theme === "dark"
                        ? "hover:bg-slate-800 text-slate-300 hover:text-white hover:scale-105"
                        : "hover:bg-slate-100 text-slate-700 hover:text-slate-900 hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${active ? "" : "group-hover:scale-110 transition-transform"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.name}</div>
                    {!active && (
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {item.description}
                      </div>
                    )}
                  </div>
                  {!active && (
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Secondary Navigation */}
          <div>
            <p
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Other
            </p>
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg scale-105"
                      : theme === "dark"
                        ? "hover:bg-slate-800 text-slate-300 hover:text-white hover:scale-105"
                        : "hover:bg-slate-100 text-slate-700 hover:text-slate-900 hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${active ? "" : "group-hover:scale-110 transition-transform"}`}
                  />
                  <span className="font-medium">{item.name}</span>
                  {!active && (
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer - Quick Tip Card */}
        <div className="p-4 border-t">
          <div
            className={`rounded-2xl p-4 ${
              theme === "dark"
                ? "bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20"
                : "bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <h4 className="font-bold text-sm">Quick Tip</h4>
            </div>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Use keyboard shortcuts to navigate faster. Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-white text-[10px] font-mono">
                ?
              </kbd>{" "}
              to see all shortcuts.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
