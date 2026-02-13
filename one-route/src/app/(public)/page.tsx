"use client";

import { useAuth } from "../hooks/useAuth";
import { useUI } from "../hooks/useUI";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  BarChart3, 
  Zap, 
  Shield, 
  Users,
  Sun,
  Moon,
  Sparkles,
  TrendingUp,
  Target,
  Bell
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useUI();

  const features = [
    {
      icon: CheckCircle2,
      title: "Smart Tracking",
      description: "Track applications from submission to offer with intelligent status updates"
    },
    {
      icon: Calendar,
      title: "Never Miss Deadlines",
      description: "Automated reminders for interviews, follow-ups, and important dates"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Visualize your application pipeline and success metrics"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Add and update applications in seconds with our streamlined interface"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and only accessible by you"
    },
    {
      icon: Users,
      title: "Student-Focused",
      description: "Built by students, for students seeking internships and jobs"
    }
  ];

  const stats = [
    { value: "10K+", label: "Applications Tracked" },
    { value: "2.5K+", label: "Active Students" },
    { value: "78%", label: "Success Rate" },
    { value: "24/7", label: "Access Anywhere" }
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900"
      }`}
    >
      {/* Floating Theme Toggle - Modern Position */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-110 active:scale-95 group ${
          theme === "dark"
            ? "bg-white/10 border-white/20 hover:bg-white/20 text-yellow-300"
            : "bg-slate-900/10 border-slate-900/20 hover:bg-slate-900/20 text-slate-900"
        }`}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
        ) : (
          <Moon className="w-5 h-5 transition-transform group-hover:-rotate-12 duration-300" />
        )}
      </button>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 group-hover:scale-110 ${
              theme === "dark"
                ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50"
                : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30"
            }`}>
              OR
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              OneRoute
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50"
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hidden sm:block px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                    theme === "dark"
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-900/5"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70"
                      : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50"
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 backdrop-blur-xl">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                The Smart Way to Track Applications
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Land Your Dream{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                  Opportunity
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C60 2 140 2 198 10"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#D946EF" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className={`text-lg md:text-xl leading-relaxed max-w-xl ${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}>
              OneRoute streamlines your job search journey. Track applications, 
              manage interviews, and never miss an opportunity with our intelligent 
              tracking system designed for students and professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="group relative px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    Open Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="group relative px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center gap-2">
                      Start Free Today
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Link>
                  <Link
                    href="/login"
                    className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 border-2 ${
                      theme === "dark"
                        ? "border-white/20 hover:bg-white/10 text-white"
                        : "border-slate-900/20 hover:bg-slate-900/5 text-slate-900"
                    }`}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full border-2 ${
                        theme === "dark" ? "border-slate-900" : "border-white"
                      } bg-gradient-to-br from-violet-400 to-fuchsia-400`}
                    />
                  ))}
                </div>
                <div className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                  <span className="font-semibold text-violet-600">2,500+</span> students joined
                </div>
              </div>
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="relative">
            {/* Floating Elements */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-violet-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-fuchsia-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className={`relative rounded-3xl p-8 backdrop-blur-xl border shadow-2xl transform hover:scale-[1.02] transition-all duration-500 ${
              theme === "dark"
                ? "bg-slate-800/50 border-slate-700/50 shadow-violet-500/20"
                : "bg-white/80 border-slate-200/50 shadow-violet-600/10"
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Quick Stats</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Applied", value: "24", color: "blue" },
                  { label: "Interview", value: "8", color: "yellow" },
                  { label: "Offers", value: "3", color: "green" },
                  { label: "Pending", value: "5", color: "purple" }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`p-4 rounded-2xl border ${
                      theme === "dark"
                        ? "bg-slate-900/50 border-slate-700/50"
                        : "bg-slate-50/50 border-slate-200/50"
                    }`}
                  >
                    <div className={`text-2xl font-bold mb-1 ${
                      stat.color === "blue" ? "text-blue-500" :
                      stat.color === "yellow" ? "text-yellow-500" :
                      stat.color === "green" ? "text-green-500" :
                      "text-purple-500"
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini Application List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                  <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                    Recent Applications
                  </span>
                  <Bell className="w-4 h-4 text-violet-500" />
                </div>
                {[
                  { company: "Google", role: "SWE Intern", status: "Interview" },
                  { company: "Meta", role: "Product Intern", status: "Applied" },
                  { company: "Amazon", role: "ML Intern", status: "Offer" }
                ].map((app, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      theme === "dark"
                        ? "bg-slate-900/30 border-slate-700/50 hover:bg-slate-900/50"
                        : "bg-white/50 border-slate-200/50 hover:bg-white/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{app.company}</div>
                        <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                          {app.role}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === "Offer" ? "bg-green-500/20 text-green-600" :
                        app.status === "Interview" ? "bg-yellow-500/20 text-yellow-600" :
                        "bg-blue-500/20 text-blue-600"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 border-y ${
        theme === "dark" ? "border-slate-800 bg-slate-900/30" : "border-slate-200 bg-slate-50/50"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className={`text-sm md:text-base ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 backdrop-blur-xl mb-4">
            <Target className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Features Built for Success
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === "dark" ? "text-slate-300" : "text-slate-600"
          }`}>
            OneRoute combines powerful tracking with intelligent insights to help you 
            manage your applications efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`group p-8 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:shadow-violet-500/20"
                    : "bg-white/50 border-slate-200/50 hover:bg-white hover:shadow-violet-600/10"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"
                    : "bg-gradient-to-br from-violet-100 to-fuchsia-100"
                }`}>
                  <Icon className="w-7 h-7 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className={`relative rounded-3xl p-12 md:p-16 overflow-hidden ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-800 to-slate-900"
            : "bg-gradient-to-br from-violet-50 to-fuchsia-50"
        }`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 rounded-full blur-3xl" />
          
          <div className="relative text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Take Control of Your{" "}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Career Journey?
              </span>
            </h2>
            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}>
              Join thousands of students who are landing their dream opportunities with OneRoute
            </p>
            {!isAuthenticated && (
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-violet-600/30"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 ${
        theme === "dark" ? "border-slate-800" : "border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                theme === "dark"
                  ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
                  : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"
              }`}>
                OR
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                OneRoute
              </span>
            </div>
            <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              © 2026 OneRoute. Built for students, by students.
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}