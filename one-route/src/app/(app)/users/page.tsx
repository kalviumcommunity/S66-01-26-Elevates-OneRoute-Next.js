"use client";

import { useState } from "react";
import { useUI } from "@/app/hooks/useUI";
import Link from "next/link";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  TrendingUp,
  Users as UsersIcon,
  Star,
  CheckCircle2,
  Clock,
  Grid3x3,
  List,
  Download,
  ArrowUpRight,
  Shield,
  Award
} from "lucide-react";

// Enhanced mock data with more details
const users = [
  { 
    id: "1", 
    name: "Aarav Sharma",
    email: "aarav.sharma@university.edu",
    avatar: "AS",
    role: "Student",
    location: "Mumbai, India",
    applications: 15,
    offers: 2,
    joinDate: "Jan 2024",
    status: "active",
    priority: true,
    successRate: 13.3
  },
  { 
    id: "2", 
    name: "Neha Verma",
    email: "neha.verma@university.edu",
    avatar: "NV",
    role: "Student",
    location: "Delhi, India",
    applications: 22,
    offers: 3,
    joinDate: "Dec 2023",
    status: "active",
    priority: true,
    successRate: 13.6
  },
  { 
    id: "3", 
    name: "Rohan Patel",
    email: "rohan.patel@university.edu",
    avatar: "RP",
    role: "Student",
    location: "Bangalore, India",
    applications: 8,
    offers: 1,
    joinDate: "Feb 2024",
    status: "active",
    priority: false,
    successRate: 12.5
  },
  { 
    id: "4", 
    name: "Priya Singh",
    email: "priya.singh@university.edu",
    avatar: "PS",
    role: "Student",
    location: "Pune, India",
    applications: 18,
    offers: 2,
    joinDate: "Jan 2024",
    status: "active",
    priority: false,
    successRate: 11.1
  },
  { 
    id: "5", 
    name: "Arjun Reddy",
    email: "arjun.reddy@university.edu",
    avatar: "AR",
    role: "Premium",
    location: "Hyderabad, India",
    applications: 25,
    offers: 4,
    joinDate: "Nov 2023",
    status: "active",
    priority: true,
    successRate: 16.0
  },
];

export default function UsersPage() {
  const { theme } = useUI();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterRole, setFilterRole] = useState<"all" | "student" | "premium">("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role.toLowerCase() === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    premium: users.filter(u => u.role === "Premium").length,
    avgApplications: Math.round(users.reduce((acc, u) => acc + u.applications, 0) / users.length)
  };

  const getAvatarGradient = (index: number) => {
    const gradients = [
      "from-violet-500 to-fuchsia-500",
      "from-blue-500 to-cyan-500",
      "from-pink-500 to-rose-500",
      "from-orange-500 to-amber-500",
      "from-green-500 to-emerald-500"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <UsersIcon className="w-5 h-5 text-violet-500" />
            <span className="text-sm font-medium text-violet-600">User Management</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Users</h1>
              <p className={`text-lg ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Manage and view all registered users
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-violet-600/30 w-fit">
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: "Total Users", 
              value: stats.total, 
              icon: UsersIcon, 
              color: "purple",
              trend: "+2 this month"
            },
            { 
              label: "Active Users", 
              value: stats.active, 
              icon: CheckCircle2, 
              color: "green",
              trend: "100% active"
            },
            { 
              label: "Premium Users", 
              value: stats.premium, 
              icon: Star, 
              color: "yellow",
              trend: `${Math.round((stats.premium / stats.total) * 100)}% of total`
            },
            { 
              label: "Avg Applications", 
              value: stats.avgApplications, 
              icon: TrendingUp, 
              color: "blue",
              trend: "Per user"
            }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 border backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700/50 hover:shadow-violet-500/20"
                    : "bg-white/80 border-slate-200/50 hover:shadow-violet-600/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${
                    stat.color === "purple" ? "bg-violet-500/20" :
                    stat.color === "green" ? "bg-green-500/20" :
                    stat.color === "yellow" ? "bg-yellow-500/20" :
                    "bg-blue-500/20"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      stat.color === "purple" ? "text-violet-600" :
                      stat.color === "green" ? "text-green-600" :
                      stat.color === "yellow" ? "text-yellow-600" :
                      "text-blue-600"
                    }`} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className={`text-xs mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  {stat.label}
                </div>
                <div className={`text-xs font-medium ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                  {stat.trend}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              theme === "dark" ? "text-slate-500" : "text-slate-400"
            }`} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            {["all", "student", "premium"].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role as any)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 capitalize ${
                  filterRole === role
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg scale-105"
                    : theme === "dark"
                    ? "bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-white"
                    : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-900"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className={`flex rounded-xl border overflow-hidden ${
            theme === "dark" ? "border-slate-700" : "border-slate-200"
          }`}>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 transition-all duration-300 ${
                viewMode === "grid"
                  ? theme === "dark"
                    ? "bg-slate-800 text-violet-400"
                    : "bg-violet-50 text-violet-600"
                  : theme === "dark"
                  ? "bg-slate-800/50 text-slate-400 hover:text-white"
                  : "bg-white text-slate-400 hover:text-slate-900"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 transition-all duration-300 ${
                viewMode === "list"
                  ? theme === "dark"
                    ? "bg-slate-800 text-violet-400"
                    : "bg-violet-50 text-violet-600"
                  : theme === "dark"
                  ? "bg-slate-800/50 text-slate-400 hover:text-white"
                  : "bg-white text-slate-400 hover:text-slate-900"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Export Button */}
          <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}>
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Users Display */}
        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, idx) => (
              <div
                key={user.id}
                className={`group rounded-2xl p-6 border backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700/50 hover:shadow-violet-500/20"
                    : "bg-white/80 border-slate-200/50 hover:shadow-violet-600/10"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br ${getAvatarGradient(idx)} shadow-lg`}>
                    {user.avatar}
                  </div>
                  <div className="flex items-center gap-2">
                    {user.priority && (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    )}
                    {user.role === "Premium" && (
                      <div className="p-1.5 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20">
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                    )}
                    <button className={`p-2 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 ${
                      theme === "dark" ? "hover:bg-slate-700" : "hover:bg-slate-100"
                    }`}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* User Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-1">{user.name}</h3>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Mail className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={`${theme === "dark" ? "text-slate-400" : "text-slate-600"} truncate`}>
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                      {user.location}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className={`grid grid-cols-3 gap-3 py-3 mb-4 border-y ${
                  theme === "dark" ? "border-slate-700" : "border-slate-200"
                }`}>
                  <div className="text-center">
                    <div className="text-xl font-bold text-violet-600">{user.applications}</div>
                    <div className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                      Apps
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{user.offers}</div>
                    <div className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                      Offers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{user.successRate}%</div>
                    <div className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                      Rate
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={theme === "dark" ? "text-slate-500" : "text-slate-400"}>
                      Joined {user.joinDate}
                    </span>
                  </div>
                  <Link
                    href={`/users/${user.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-fuchsia-600 transition-colors group/link"
                  >
                    View
                    <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredUsers.map((user, idx) => (
              <div
                key={user.id}
                className={`rounded-2xl p-6 border backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700/50 hover:shadow-violet-500/20"
                    : "bg-white/80 border-slate-200/50 hover:shadow-violet-600/10"
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br ${getAvatarGradient(idx)} shadow-lg flex-shrink-0`}>
                    {user.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">{user.name}</h3>
                      {user.priority && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      {user.role === "Premium" && (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-600">
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                        <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                        <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                          {user.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                        <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                          {user.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-violet-600">{user.applications}</div>
                      <div className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                        Applications
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{user.offers}</div>
                      <div className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                        Offers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{user.successRate}%</div>
                      <div className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                        Success
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/users/${user.id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      View Profile
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                      theme === "dark" ? "hover:bg-slate-700" : "hover:bg-slate-100"
                    }`}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className={`text-center py-16 rounded-2xl border backdrop-blur-xl ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-white/80 border-slate-200/50"
          }`}>
            <UsersIcon className={`w-16 h-16 mx-auto mb-4 ${
              theme === "dark" ? "text-slate-600" : "text-slate-400"
            }`} />
            <h3 className="text-xl font-bold mb-2">No users found</h3>
            <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}