"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  Plus,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Target,
  Bell,
  Settings,
  MapPin,
  Briefcase,
  Building2,
  Sparkles,
  ArrowUpRight,
  Activity,
  Zap,
  Star,
  ChevronRight,
  FileText,
  BarChart3,
} from "lucide-react";
import { useUIContext } from "@/app/context/UIContext";

const DashboardPage = () => {
  const { theme } = useUIContext();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with real data
  const stats = {
    total: 12,
    applied: 8,
    interview: 3,
    offer: 1,
    rejected: 2,
  };

  const recentApplications = [
    {
      id: 1,
      company: "Google",
      position: "Software Engineer Intern",
      status: "interview",
      dateApplied: "2024-02-01",
      nextStep: "Technical Interview - Feb 20",
      salary: "$8,500/mo",
      location: "Mountain View, CA",
      logo: "🔍",
      priority: "high",
    },
    {
      id: 2,
      company: "Meta",
      position: "Product Design Intern",
      status: "applied",
      dateApplied: "2024-02-05",
      nextStep: "Waiting for response",
      salary: "$9,000/mo",
      location: "Menlo Park, CA",
      logo: "👥",
      priority: "medium",
    },
    {
      id: 3,
      company: "Amazon",
      position: "ML Engineer Intern",
      status: "offer",
      dateApplied: "2024-01-15",
      nextStep: "Accept by Feb 25",
      salary: "$8,000/mo",
      location: "Seattle, WA",
      logo: "📦",
      priority: "high",
    },
  ];

  const followUps = [
    {
      date: "2024-07-20",
      title: "Prepare for interview with Google - Software Engineer Intern",
      badge: "High Priority",
      time: "2:00 PM",
      type: "interview",
      company: "Google",
    },
    {
      date: "2024-07-22",
      title: "Send thank you note to Microsoft recruiter",
      badge: "Medium Priority",
      time: "10:00 AM",
      type: "task",
      company: "Microsoft",
    },
    {
      date: "2024-07-25",
      title: "Follow-up with Amazon regarding application status",
      badge: "Low Priority",
      time: "3:30 PM",
      type: "followup",
      company: "Amazon",
    },
  ];

  const weeklyActivity = [
    { day: "Mon", applications: 2 },
    { day: "Tue", applications: 1 },
    { day: "Wed", applications: 3 },
    { day: "Thu", applications: 0 },
    { day: "Fri", applications: 2 },
    { day: "Sat", applications: 1 },
    { day: "Sun", applications: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case "interview":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "offer":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-600 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-600 border-slate-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-600";
      case "medium":
        return "bg-yellow-500/20 text-yellow-600";
      case "low":
        return "bg-green-500/20 text-green-600";
      default:
        return "bg-slate-500/20 text-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Clock className="w-4 h-4" />;
      case "interview":
        return <AlertCircle className="w-4 h-4" />;
      case "offer":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <span className="text-sm font-medium text-violet-600">
              Dashboard
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back! 👋
          </h1>
          <p className={`text-lg`}>
            Here's what's happening with your applications today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total Applications",
              value: stats.total,
              icon: Target,
              color: "purple",
              trend: "+2 this week",
              trendUp: true,
            },
            {
              label: "Applied",
              value: stats.applied,
              icon: Clock,
              color: "blue",
              trend: "8 pending",
              trendUp: null,
            },
            {
              label: "Interview",
              value: stats.interview,
              icon: AlertCircle,
              color: "yellow",
              trend: "3 upcoming",
              trendUp: true,
            },
            {
              label: "Offers",
              value: stats.offer,
              icon: CheckCircle2,
              color: "green",
              trend: "+1 new",
              trendUp: true,
            },
            {
              label: "Rejected",
              value: stats.rejected,
              icon: XCircle,
              color: "red",
              trend: "Keep going!",
              trendUp: null,
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`group rounded-2xl p-6 border backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                      stat.color === "purple"
                        ? "bg-violet-500/20"
                        : stat.color === "blue"
                          ? "bg-blue-500/20"
                          : stat.color === "yellow"
                            ? "bg-yellow-500/20"
                            : stat.color === "green"
                              ? "bg-green-500/20"
                              : "bg-red-500/20"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        stat.color === "purple"
                          ? "text-violet-600"
                          : stat.color === "blue"
                            ? "text-blue-600"
                            : stat.color === "yellow"
                              ? "text-yellow-600"
                              : stat.color === "green"
                                ? "text-green-600"
                                : "text-red-600"
                      }`}
                    />
                  </div>
                  {stat.trendUp !== null && (
                    <TrendingUp
                      className={`w-4 h-4 ${
                        stat.trendUp ? "text-green-500" : "text-red-500"
                      }`}
                    />
                  )}
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className={`text-xs mb-2`}>{stat.label}</div>
                <div
                  className={`text-xs font-medium ${
                    stat.trendUp === true
                      ? "text-green-500"
                      : stat.trendUp === false
                        ? "text-red-500"
                        : "text-slate-500"
                  }`}
                >
                  {stat.trend}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Applications & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 `}
                />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
                />
              </div>
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 `}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-violet-600/30">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Application</span>
              </button>
            </div>

            {/* Recent Applications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-violet-600" />
                  Recent Applications
                </h2>
                <Link
                  href="/applications"
                  className="text-sm font-medium text-violet-600 hover:text-fuchsia-600 transition-colors flex items-center gap-1"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className={`rounded-2xl p-6 border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group `}
                  >
                    <div className="flex items-start gap-4">
                      {/* Company Logo */}
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 `}
                      >
                        {app.logo}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                              {app.company}
                              {app.priority === "high" && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              )}
                            </h3>
                            <p className={`text-sm `}>{app.position}</p>
                          </div>
                          <button
                            className={`p-2 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 `}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-4">
                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${getStatusColor(app.status)}`}
                          >
                            {getStatusIcon(app.status)}
                            <span className="capitalize font-medium">
                              {app.status}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm `}
                          >
                            <MapPin className="w-4 h-4" />
                            {app.location}
                          </div>
                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold `}
                          >
                            💰 {app.salary}
                          </div>
                        </div>

                        <div
                          className={`flex items-center justify-between text-sm `}
                        >
                          <div>
                            <strong>Next:</strong> {app.nextStep}
                          </div>
                          <div className="text-xs">
                            Applied: {app.dateApplied}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className={`rounded-2xl p-6 border backdrop-blur-xl `}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-violet-600" />
                  This Week's Activity
                </h3>
                <span className="text-sm text-violet-600 font-medium">
                  9 applications
                </span>
              </div>
              <div className="flex items-end justify-between gap-2 h-32">
                {weeklyActivity.map((day, idx) => {
                  const maxApps = Math.max(
                    ...weeklyActivity.map((d) => d.applications)
                  );
                  const height =
                    maxApps > 0 ? (day.applications / maxApps) * 100 : 0;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-violet-600 to-fuchsia-600 rounded-t-lg transition-all duration-500 hover:scale-105 cursor-pointer relative group"
                          style={{
                            height: `${height}%`,
                            minHeight: day.applications > 0 ? "20%" : "0",
                          }}
                        >
                          {day.applications > 0 && (
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              {day.applications}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-medium `}>{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Follow-ups & Insights */}
          <div className="space-y-6">
            {/* Upcoming Follow-ups */}
            <div className={`rounded-2xl p-6 border backdrop-blur-xl `}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-600" />
                  Upcoming
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full `}>
                  {followUps.length} tasks
                </span>
              </div>
              <div className="space-y-4">
                {followUps.map((task, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer `}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                          task.badge === "High Priority"
                            ? getPriorityColor("high")
                            : task.badge === "Medium Priority"
                              ? getPriorityColor("medium")
                              : getPriorityColor("low")
                        }`}
                      >
                        {task.date.split("-")[2]}{" "}
                        {new Date(task.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </div>
                      <div className={`text-xs `}>{task.time}</div>
                    </div>
                    <div className="font-semibold text-sm mb-2 line-clamp-2">
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3" />
                      <span className={`text-xs `}>{task.company}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm font-medium text-violet-600 hover:text-fuchsia-600 transition-colors">
                View all tasks →
              </button>
            </div>

            {/* Success Rate */}
            <div className={`rounded-2xl p-6 border backdrop-blur-xl `}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-600" />
                  Success Rate
                </h3>
              </div>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                  8.3%
                </div>
                <p className={`text-sm `}>Offer conversion rate</p>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Interview Rate</span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden `}>
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                      style={{ width: "25%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Rate</span>
                    <span className="font-semibold">67%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden `}>
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: "67%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tip */}
            <div className={`rounded-2xl p-6 border backdrop-blur-xl `}>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-violet-600" />
                <h3 className="text-lg font-bold">💡 Quick Tip</h3>
              </div>
              <p className={`text-sm `}>
                Follow up with recruiters 3-5 days after applying. It shows
                initiative and can move your application forward!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
