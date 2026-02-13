"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  LogIn, 
  Github, 
  Chrome,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { useUI } from "@/app/hooks/useUI";
import { useAuth } from "@/app/hooks/useAuth";
import { Role, ROLES, ROLE_DESCRIPTIONS } from "@/config/roles";

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useUI();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("STUDENT");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // mock auth
    setTimeout(() => {
      Cookies.set("token", "mock.jwt.token");
      login({
        name: email.split("@")[0] || "User",
        email,
        role: selectedRole,
      });
      router.push("/dashboard");
    }, 600);
  };

  const features = [
    "Track all your applications in one place",
    "Never miss important deadlines",
    "Get interview reminders and tips",
    "Analyze your application success rate"
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-50"
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-6xl relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Features & Branding (Hidden on mobile) */}
          <div className="hidden lg:block">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-12 group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 group-hover:scale-110 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50"
                  : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30"
              }`}>
                OR
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                OneRoute
              </span>
            </Link>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 backdrop-blur-xl">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className="text-sm font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Welcome Back!
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Continue Your{" "}
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Success Story
                </span>
              </h2>
              
              <p className={`text-lg ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                Sign in to track your applications, manage interviews, and stay on top 
                of every opportunity.
              </p>

              {/* Features List */}
              <div className="space-y-4 pt-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {[
                  { value: "2.5K+", label: "Active Users" },
                  { value: "10K+", label: "Applications" },
                  { value: "78%", label: "Success Rate" }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      theme === "dark"
                        ? "bg-slate-800/50 border-slate-700"
                        : "bg-white/50 border-slate-200"
                    }`}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div>
            {/* Mobile Logo */}
            <Link href="/" className="flex lg:hidden items-center justify-center gap-2 mb-8 group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 group-hover:scale-110 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50"
                  : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30"
              }`}>
                OR
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                OneRoute
              </span>
            </Link>

              {/* Login Card */}
            <div
              className={`rounded-3xl p-8 backdrop-blur-xl border shadow-2xl ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700/50 shadow-violet-500/20"
                  : "bg-white/80 border-slate-200/50 shadow-violet-600/10"
              }`}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className={`${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  Sign in to continue your journey
                </p>
              </div>

              {/* Role Picker */}
              <div className="mb-6">
                <p className={`${theme === "dark" ? "text-slate-300" : "text-slate-700"} text-sm font-medium mb-2`}>
                  Select your role to preview matching permissions
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ROLES.map((role) => {
                    const isActive = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`text-left rounded-2xl border px-4 py-3 transition-all duration-300 ${
                          isActive
                            ? "border-violet-500 bg-violet-500/10 shadow-lg"
                            : theme === "dark"
                              ? "border-slate-700 hover:border-violet-500/60"
                              : "border-slate-200 hover:border-violet-500/60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold">{role}</span>
                          {isActive && <CheckCircle2 className="w-4 h-4 text-violet-500" />}
                        </div>
                        <p className="text-xs leading-snug opacity-80">
                          {ROLE_DESCRIPTIONS[role]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 border ${
                    theme === "dark"
                      ? "bg-slate-900/50 border-slate-700 hover:bg-slate-900 text-white"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900"
                  }`}
                >
                  <Chrome className="w-5 h-5" />
                  <span className="hidden sm:inline">Google</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 border ${
                    theme === "dark"
                      ? "bg-slate-900/50 border-slate-700 hover:bg-slate-900 text-white"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900"
                  }`}
                >
                  <Github className="w-5 h-5" />
                  <span className="hidden sm:inline">GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className={`absolute inset-0 flex items-center ${theme === "dark" ? "text-slate-700" : "text-slate-300"}`}>
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-4 ${theme === "dark" ? "bg-slate-800/50 text-slate-400" : "bg-white/80 text-slate-600"}`}>
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                        theme === "dark"
                          ? "bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                          : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                        theme === "dark"
                          ? "bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                          : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"} transition-colors`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                    />
                    <span className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-violet-600 hover:text-fuchsia-600 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Sign In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Sign Up Link */}
              <p className={`text-center mt-6 text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-violet-600 hover:text-fuchsia-600 transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <Link
              href="/"
              className={`flex items-center justify-center gap-2 mt-6 text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}