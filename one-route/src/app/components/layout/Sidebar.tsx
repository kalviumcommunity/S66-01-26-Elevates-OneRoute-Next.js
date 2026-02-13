"use client";

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
import { useAuth } from "@/app/hooks/useAuth";
import { Permission } from "@/config/roles";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  description: string;
  requiredPermission?: Permission;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Overview & stats" },
  { name: "Applications", href: "/applications", icon: Briefcase, description: "Track your apps" },
  { name: "Users", href: "/users", icon: Users, description: "Manage users", requiredPermission: "users.read" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, description: "Insights & reports", requiredPermission: "reports.view" },
  { name: "Documents", href: "/documents", icon: FileText, description: "Resumes & files" },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useUIContext();
  const { user, role, can } = useAuth();

  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname?.startsWith(href));

  const visibleNav = navigation.filter(
    (item) => !item.requiredPermission || can(item.requiredPermission)
  );

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } border-r flex flex-col w-72 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 border-slate-200`}
      >
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

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="mb-6">
            <p
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Main Menu
            </p>
            {visibleNav.map((item) => {
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
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "" : "group-hover:scale-110 transition-transform"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.name}</div>
                    {!active && (
                      <div className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                        {item.description}
                      </div>
                    )}
                  </div>
                  {!active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </Link>
              );
            })}
          </div>

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
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "" : "group-hover:scale-110 transition-transform"}`} />
                  <span className="font-medium">{item.name}</span>
                  {!active && (
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t space-y-4">
          <div
            className={`rounded-2xl p-4 ${
              theme === "dark"
                ? "bg-slate-800 border border-slate-700"
                : "bg-slate-50 border border-slate-200"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">Access Level</p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <div className="text-sm font-semibold">{user?.name ?? "Guest"}</div>
                <div className="text-xs text-slate-500">{role ?? "UNASSIGNED"}</div>
              </div>
              <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-600">
                RBAC
              </span>
            </div>
          </div>

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
            <p className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
              Use keyboard shortcuts to navigate faster. Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-white text-[10px] font-mono">?</kbd>{" "}
              to see all shortcuts.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
