"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
  Download,
  Share2,
} from "lucide-react";
import { useUIContext } from "@/app/context/UIContext";

const ApplicationsPage = () => {
  const { theme } = useUIContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock data - replace with real API call
  const applications = [
    {
      id: 1,
      company: "Google",
      position: "Software Engineer Intern",
      status: "interview",
      dateApplied: "2024-02-01",
      location: "Mountain View, CA",
      salary: "$8,500/mo",
      logo: "🔍",
      interviewDate: "2024-02-20",
    },
    {
      id: 2,
      company: "Meta",
      position: "Product Design Intern",
      status: "applied",
      dateApplied: "2024-02-05",
      location: "Menlo Park, CA",
      salary: "$9,000/mo",
      logo: "👥",
      interviewDate: null,
    },
    {
      id: 3,
      company: "Amazon",
      position: "ML Engineer Intern",
      status: "offer",
      dateApplied: "2024-01-15",
      location: "Seattle, WA",
      salary: "$8,000/mo",
      logo: "📦",
      interviewDate: null,
    },
    {
      id: 4,
      company: "Microsoft",
      position: "Cloud Solutions Intern",
      status: "rejected",
      dateApplied: "2024-01-20",
      location: "Redmond, WA",
      salary: "$8,200/mo",
      logo: "💻",
      interviewDate: null,
    },
    {
      id: 5,
      company: "Apple",
      position: "iOS Developer Intern",
      status: "applied",
      dateApplied: "2024-02-10",
      location: "Cupertino, CA",
      salary: "$9,500/mo",
      logo: "🍎",
      interviewDate: null,
    },
    {
      id: 6,
      company: "Tesla",
      position: "Electrical Engineer Intern",
      status: "interview",
      dateApplied: "2024-02-08",
      location: "Austin, TX",
      salary: "$8,800/mo",
      logo: "⚡",
      interviewDate: "2024-02-25",
    },
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "all" || app.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const statusConfig = {
    applied: {
      icon: Clock,
      color: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      label: "Applied",
    },
    interview: {
      icon: AlertCircle,
      color: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
      label: "Interview Scheduled",
    },
    offer: {
      icon: CheckCircle2,
      color: "bg-green-500/20 text-green-600 border-green-500/30",
      label: "Offer Received",
    },
    rejected: {
      icon: XCircle,
      color: "bg-red-500/20 text-red-600 border-red-500/30",
      label: "Rejected",
    },
  };

  const toggleSelection = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selected.length === filteredApplications.length) {
      setSelected([]);
    } else {
      setSelected(filteredApplications.map((app) => app.id));
    }
  };

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-900" : "bg-slate-50"}`}>
      {/* Header */}
      <div className={`border-b ${theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
        <div className="px-6 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Applications
              </h1>
              <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                Track all your internship applications
              </p>
            </div>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                theme === "dark"
                  ? "bg-violet-600 hover:bg-violet-700 text-white"
                  : "bg-violet-600 hover:bg-violet-700 text-white"
              }`}
            >
              <Plus className="w-5 h-5" />
              New Application
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total", value: stats.total, color: "from-slate-600 to-slate-700" },
              { label: "Applied", value: stats.applied, color: "from-blue-600 to-blue-700" },
              { label: "Interviews", value: stats.interview, color: "from-yellow-600 to-yellow-700" },
              { label: "Offers", value: stats.offer, color: "from-green-600 to-green-700" },
              { label: "Rejected", value: stats.rejected, color: "from-red-600 to-red-700" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  theme === "dark"
                    ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                    : "border-slate-200 bg-slate-100/50 hover:bg-slate-100"
                }`}
              >
                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold mt-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
            <input
              type="text"
              placeholder="Search companies or positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg transition-all duration-300 ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-violet-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500"
              } border focus:outline-none`}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white focus:border-violet-500"
                : "bg-white border-slate-200 text-slate-900 focus:border-violet-500"
            } focus:outline-none`}
          >
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Applications Table */}
        <div
          className={`rounded-lg border overflow-hidden ${
            theme === "dark" ? "border-slate-800 bg-slate-800/50" : "border-slate-200 bg-white"
          }`}
        >
          {/* Header */}
          <div
            className={`p-4 border-b flex items-center gap-4 ${
              theme === "dark" ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.length === filteredApplications.length && filteredApplications.length > 0}
              onChange={toggleAllSelection}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <div className="flex-1 text-sm font-semibold text-slate-600 dark:text-slate-400">
              {selected.length > 0 ? `${selected.length} selected` : "Company"}
            </div>
          </div>

          {/* Applications List */}
          <div className="divide-y" style={{ divideColor: theme === "dark" ? "#1e293b" : "#e2e8f0" }}>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => {
                const StatusIcon = statusConfig[app.status as keyof typeof statusConfig].icon;
                const statusInfo = statusConfig[app.status as keyof typeof statusConfig];

                return (
                  <div
                    key={app.id}
                    className={`p-4 hover:bg-opacity-50 transition-all duration-300 cursor-pointer ${
                      theme === "dark" ? "hover:bg-slate-700/30" : "hover:bg-slate-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(app.id)}
                        onChange={() => toggleSelection(app.id)}
                        className="w-4 h-4 rounded cursor-pointer"
                      />

                      <div className="flex-1 flex items-center gap-4">
                        <div className="text-2xl">{app.logo}</div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                            {app.company}
                          </h3>
                          <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                            {app.position}
                          </p>
                        </div>
                      </div>

                      <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </div>

                      <button
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          theme === "dark"
                            ? "hover:bg-slate-700 text-slate-400 hover:text-slate-300"
                            : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="ml-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                        <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                          {new Date(app.dateApplied).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                        <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                          {app.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Briefcase className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                        <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                          {app.salary}
                        </span>
                      </div>

                      {app.interviewDate && (
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${theme === "dark" ? "text-yellow-500" : "text-yellow-500"}`} />
                          <span className={theme === "dark" ? "text-yellow-400" : "text-yellow-600"}>
                            Interview: {new Date(app.interviewDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <Briefcase className={`w-12 h-12 mx-auto mb-4 opacity-30 ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`} />
                <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                  No applications found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div className={`mt-6 p-4 rounded-lg border flex items-center justify-between ${
            theme === "dark"
              ? "border-violet-500/30 bg-violet-500/10"
              : "border-violet-500/30 bg-violet-500/10"
          }`}>
            <span className={`font-medium ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}>
              {selected.length} application{selected.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                theme === "dark"
                  ? "hover:bg-slate-700 text-slate-300"
                  : "hover:bg-slate-100 text-slate-700"
              }`}>
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                theme === "dark"
                  ? "hover:bg-slate-700 text-slate-300"
                  : "hover:bg-slate-100 text-slate-700"
              }`}>
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
