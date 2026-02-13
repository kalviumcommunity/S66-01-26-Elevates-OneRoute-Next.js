"use client";

import { useState, useEffect } from "react";
import { useUI } from "@/app/hooks/useUI";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  TrendingUp,
  Star,
  Award,
  Edit,
  MoreVertical,
  Phone,
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Target,
  Activity,
  BarChart3,
  FileText,
  Download,
  Send,
  Ban,
  Shield
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

// Same users data from UsersPage
const usersDatabase = [
  { 
    id: "1", 
    name: "Aarav Sharma",
    email: "aarav.sharma@university.edu",
    phone: "+91 98765 43210",
    avatar: "AS",
    role: "Student",
    location: "Mumbai, India",
    university: "IIT Bombay",
    major: "Computer Science",
    graduationYear: "2025",
    applications: 15,
    offers: 2,
    joinDate: "Jan 15, 2024",
    status: "active",
    priority: true,
    successRate: 13.3,
    bio: "Aspiring software engineer passionate about AI/ML and full-stack development. Looking for summer 2025 internship opportunities.",
    website: "aaravsharma.dev",
    linkedin: "linkedin.com/in/aaravsharma",
    github: "github.com/aaravsharma",
    lastActive: "2 hours ago",
    isPremium: false
  },
  { 
    id: "2", 
    name: "Neha Verma",
    email: "neha.verma@university.edu",
    phone: "+91 98765 43211",
    avatar: "NV",
    role: "Student",
    location: "Delhi, India",
    university: "Delhi University",
    major: "Data Science",
    graduationYear: "2024",
    applications: 22,
    offers: 3,
    joinDate: "Dec 10, 2023",
    status: "active",
    priority: true,
    successRate: 13.6,
    bio: "Data enthusiast with a passion for analytics and machine learning. Seeking roles in data engineering and analysis.",
    website: "nehaverma.io",
    linkedin: "linkedin.com/in/nehaverma",
    github: "github.com/nehaverma",
    lastActive: "1 day ago",
    isPremium: false
  },
  { 
    id: "3", 
    name: "Rohan Patel",
    email: "rohan.patel@university.edu",
    phone: "+91 98765 43212",
    avatar: "RP",
    role: "Student",
    location: "Bangalore, India",
    university: "IIT Bangalore",
    major: "Software Engineering",
    graduationYear: "2025",
    applications: 8,
    offers: 1,
    joinDate: "Feb 5, 2024",
    status: "active",
    priority: false,
    successRate: 12.5,
    bio: "Full-stack developer with experience in React, Node.js, and cloud technologies. Looking for backend engineering roles.",
    website: "rohanpatel.dev",
    linkedin: "linkedin.com/in/rohanpatel",
    github: "github.com/rohanpatel",
    lastActive: "5 hours ago",
    isPremium: false
  },
  { 
    id: "4", 
    name: "Priya Singh",
    email: "priya.singh@university.edu",
    phone: "+91 98765 43213",
    avatar: "PS",
    role: "Student",
    location: "Pune, India",
    university: "Pune University",
    major: "Information Technology",
    graduationYear: "2025",
    applications: 18,
    offers: 2,
    joinDate: "Jan 20, 2024",
    status: "active",
    priority: false,
    successRate: 11.1,
    bio: "Passionate about mobile development and UX design. Building apps that make a difference.",
    website: "priyasingh.com",
    linkedin: "linkedin.com/in/priyasingh",
    github: "github.com/priyasingh",
    lastActive: "3 hours ago",
    isPremium: false
  },
  { 
    id: "5", 
    name: "Arjun Reddy",
    email: "arjun.reddy@university.edu",
    phone: "+91 98765 43214",
    avatar: "AR",
    role: "Premium",
    location: "Hyderabad, India",
    university: "IIIT Hyderabad",
    major: "Artificial Intelligence",
    graduationYear: "2024",
    applications: 25,
    offers: 4,
    joinDate: "Nov 1, 2023",
    status: "active",
    priority: true,
    successRate: 16.0,
    bio: "AI researcher and engineer specializing in NLP and computer vision. Multiple publications and open-source contributions.",
    website: "arjunreddy.ai",
    linkedin: "linkedin.com/in/arjunreddy",
    github: "github.com/arjunreddy",
    lastActive: "30 minutes ago",
    isPremium: true
  },
];

// Generate applications based on user
const generateApplications = (userId: string, userName: string) => {
  const baseApps = [
    { company: "Google", position: "Software Engineering Intern", status: "interview", salary: "$8,500/mo", location: "Mountain View, CA" },
    { company: "Meta", position: "Product Design Intern", status: "applied", salary: "$9,000/mo", location: "Menlo Park, CA" },
    { company: "Amazon", position: "ML Engineer Intern", status: "offer", salary: "$8,000/mo", location: "Seattle, WA" },
    { company: "Microsoft", position: "Cloud Solutions Intern", status: "rejected", salary: "$7,800/mo", location: "Redmond, WA" },
    { company: "Apple", position: "iOS Developer Intern", status: "applied", salary: "$9,500/mo", location: "Cupertino, CA" },
  ];
  
  // Mix based on user ID
  const seed = parseInt(userId);
  const userApps = baseApps.map((app, idx) => ({
    ...app,
    id: idx + 1,
    appliedDate: `${["Jan", "Feb", "Dec"][seed % 3]} ${10 + idx}, 2024`,
    lastUpdate: `Feb ${10 + seed + idx}, 2024`
  }));
  
  return userApps.slice(0, 3 + seed); // Different number of apps per user
};

// Generate activity timeline
const generateActivity = (userName: string) => [
  { date: "2 hours ago", action: "Updated resume", type: "update" },
  { date: "1 day ago", action: `Applied to Google - Software Engineer Intern`, type: "application" },
  { date: "3 days ago", action: "Completed interview with Amazon", type: "interview" },
  { date: "5 days ago", action: "Received offer from Amazon", type: "offer" },
  { date: "1 week ago", action: "Profile viewed by 3 recruiters", type: "view" }
];

export default function UserProfile({ params }: Props) {
  const { theme } = useUI();
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "activity">("overview");
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    params.then(p => {
      setUserId(p.id);
      const foundUser = usersDatabase.find(u => u.id === p.id);
      setUser(foundUser || usersDatabase[0]); // Fallback to first user
    });
  }, [params]);

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-slate-950" : "bg-slate-50"
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>Loading user profile...</p>
        </div>
      </div>
    );
  }

  const applications = generateApplications(user.id, user.name);
  const activityTimeline = generateActivity(user.name);

  const stats = {
    applications: user.applications,
    interviews: Math.floor(user.applications * 0.3),
    offers: user.offers,
    rejected: Math.floor(user.applications * 0.2),
    successRate: user.successRate,
    avgResponseTime: "5 days",
    completedProfile: user.isPremium ? 100 : 85
  };

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "interview":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "offer":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "update":
        return <Edit className="w-4 h-4 text-purple-500" />;
      case "view":
        return <Activity className="w-4 h-4 text-indigo-500" />;
      default:
        return <Target className="w-4 h-4 text-slate-500" />;
    }
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
        {/* Breadcrumb */}
        <nav className={`flex items-center gap-2 text-sm mb-6 ${
          theme === "dark" ? "text-slate-400" : "text-slate-600"
        }`}>
          <Link href="/dashboard" className="hover:text-violet-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/users" className="hover:text-violet-600 transition-colors">
            Users
          </Link>
          <span>/</span>
          <span className={theme === "dark" ? "text-white" : "text-slate-900"}>
            {user.name}
          </span>
        </nav>

        {/* Back Button */}
        <Link
          href="/users"
          className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
            theme === "dark"
              ? "bg-slate-800/50 hover:bg-slate-800 text-white"
              : "bg-white hover:bg-slate-50 text-slate-900"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>

        {/* Profile Header Card */}
        <div className={`rounded-3xl p-8 border backdrop-blur-xl shadow-2xl mb-8 ${
          theme === "dark"
            ? "bg-slate-800/50 border-slate-700/50"
            : "bg-white/80 border-slate-200/50"
        }`}>
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center text-center lg:text-left lg:flex-row gap-6">
              <div className="relative">
                <div className={`w-32 h-32 rounded-2xl flex items-center justify-center font-bold text-4xl text-white shadow-2xl ${
                  user.id === "1" ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-violet-500/50" :
                  user.id === "2" ? "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/50" :
                  user.id === "3" ? "bg-gradient-to-br from-pink-500 to-rose-500 shadow-pink-500/50" :
                  user.id === "4" ? "bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/50" :
                  "bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/50"
                }`}>
                  {user.avatar}
                </div>
                {user.isPremium && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {user.status === "active" && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
                <p className={`text-lg mb-4 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  {user.major} • {user.university}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                    <a href={`mailto:${user.email}`} className="text-violet-600 hover:text-fuchsia-600">
                      {user.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                      {user.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                      {user.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                      Graduating {user.graduationYear}
                    </span>
                  </div>
                </div>

                <p className={`max-w-2xl ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                  {user.bio}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex lg:flex-col gap-3 ml-auto">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl">
                <Send className="w-4 h-4" />
                Message
              </button>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium border transition-all duration-300 hover:scale-105 ${
                theme === "dark"
                  ? "bg-slate-900/50 border-slate-700 hover:bg-slate-900"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}>
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                theme === "dark" ? "hover:bg-slate-900" : "hover:bg-slate-100"
              }`}>
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
            {user.website && (
              <a
                href={`https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-slate-900/50 hover:bg-slate-900"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <Globe className="w-4 h-4" />
                {user.website}
              </a>
            )}
            {user.linkedin && (
              <a
                href={`https://${user.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-slate-900/50 hover:bg-slate-900"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                LinkedIn
              </a>
            )}
            {user.github && (
              <a
                href={`https://${user.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-slate-900/50 hover:bg-slate-900"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Applications", value: stats.applications, icon: FileText, color: "violet" },
            { label: "Interviews", value: stats.interviews, icon: AlertCircle, color: "yellow" },
            { label: "Offers", value: stats.offers, icon: CheckCircle2, color: "green" },
            { label: "Success Rate", value: `${stats.successRate}%`, icon: TrendingUp, color: "blue" }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700/50"
                    : "bg-white/80 border-slate-200/50"
                }`}
              >
                <div className={`p-2 rounded-xl w-fit mb-3 ${
                  stat.color === "violet" ? "bg-violet-500/20" :
                  stat.color === "yellow" ? "bg-yellow-500/20" :
                  stat.color === "green" ? "bg-green-500/20" :
                  "bg-blue-500/20"
                }`}>
                  <Icon className={`w-5 h-5 ${
                    stat.color === "violet" ? "text-violet-600" :
                    stat.color === "yellow" ? "text-yellow-600" :
                    stat.color === "green" ? "text-green-600" :
                    "text-blue-600"
                  }`} />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "applications", label: "Applications", icon: Briefcase },
            { id: "activity", label: "Activity", icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg scale-105"
                    : theme === "dark"
                    ? "bg-slate-800/50 hover:bg-slate-800 text-slate-300"
                    : "bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Completion */}
              <div className={`rounded-2xl p-6 border backdrop-blur-xl ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700/50"
                  : "bg-white/80 border-slate-200/50"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Profile Completion</h3>
                  <span className="text-2xl font-bold text-violet-600">{stats.completedProfile}%</span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${
                  theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-500"
                    style={{ width: `${stats.completedProfile}%` }}
                  />
                </div>
                <p className={`text-sm mt-3 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  {user.isPremium ? "Profile complete! Keep up the great work." : "Add your portfolio and projects to complete your profile"}
                </p>
              </div>

              {/* Recent Applications */}
              <div className={`rounded-2xl p-6 border backdrop-blur-xl ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700/50"
                  : "bg-white/80 border-slate-200/50"
              }`}>
                <h3 className="text-lg font-bold mb-4">Recent Applications</h3>
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                        theme === "dark"
                          ? "bg-slate-900/50 border-slate-700/50"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{app.company}</h4>
                          <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                            {app.position}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          <span className="capitalize">{app.status}</span>
                        </div>
                      </div>
                      <div className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                        Applied: {app.appliedDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Info Cards */}
            <div className="space-y-6">
              {/* Account Info */}
              <div className={`rounded-2xl p-6 border backdrop-blur-xl ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700/50"
                  : "bg-white/80 border-slate-200/50"
              }`}>
                <h3 className="text-lg font-bold mb-4">Account Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>User ID</span>
                    <p className="font-semibold">{user.id}</p>
                  </div>
                  <div>
                    <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>Joined</span>
                    <p className="font-semibold">{user.joinDate}</p>
                  </div>
                  <div>
                    <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>Last Active</span>
                    <p className="font-semibold">{user.lastActive}</p>
                  </div>
                  <div>
                    <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>Account Type</span>
                    <p className="font-semibold">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`rounded-2xl p-6 border backdrop-blur-xl ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700/50"
                  : "bg-white/80 border-slate-200/50"
              }`}>
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                    theme === "dark"
                      ? "bg-slate-900/50 hover:bg-slate-900"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}>
                    <Download className="w-5 h-5 text-violet-600" />
                    <span className="font-medium">Export Data</span>
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                    theme === "dark"
                      ? "bg-slate-900/50 hover:bg-slate-900"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}>
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Reset Password</span>
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 text-red-600 ${
                    theme === "dark"
                      ? "bg-red-500/10 hover:bg-red-500/20"
                      : "bg-red-50 hover:bg-red-100"
                  }`}>
                    <Ban className="w-5 h-5" />
                    <span className="font-medium">Suspend Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className={`rounded-2xl p-6 border backdrop-blur-xl ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-white/80 border-slate-200/50"
          }`}>
            <h3 className="text-lg font-bold mb-6">All Applications</h3>
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                    theme === "dark"
                      ? "bg-slate-900/50 border-slate-700/50"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-1">{app.company}</h4>
                      <p className={`mb-3 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                        {app.position}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                          {app.location}
                        </div>
                        <div className="font-semibold text-green-600">
                          💰 {app.salary}
                        </div>
                        <div className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                          Applied: {app.appliedDate}
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="capitalize font-medium">{app.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className={`rounded-2xl p-6 border backdrop-blur-xl ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-white/80 border-slate-200/50"
          }`}>
            <h3 className="text-lg font-bold mb-6">Activity Timeline</h3>
            <div className="space-y-4">
              {activityTimeline.map((activity, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className={`p-3 rounded-xl h-fit ${
                    theme === "dark" ? "bg-slate-900/50" : "bg-slate-50"
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{activity.action}</p>
                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                      {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}