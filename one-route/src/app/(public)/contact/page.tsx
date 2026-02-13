"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  ContactFormData } from "@/schemas/contact.schema";
import { useToast } from "@/app/hooks/useToast";
import { useUI } from "@/app/hooks/useUI";
import Link from "next/link";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Linkedin, 
  Twitter, 
  Github,
  Phone,
  Sparkles,
  User,
  HelpCircle
} from "lucide-react";
import { contactSchema } from "@/lib/schemas/contact";
import { sanitizePayload } from "@/lib/security/sanitizer";

export default function ContactPage() {
  const toast = useToast();
  const { theme } = useUI();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const safeData = sanitizePayload(data);
    toast.loading("Sending message...");

    try {
      await new Promise((res) => setTimeout(res, 800));
      toast.dismiss();
      toast.success(`Thanks, ${safeData.name || "friend"}! Message received safely.`);
      reset(); // Clear form after success
    } catch {
      toast.dismiss();
      toast.error("Failed to send message");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@oneroute.app",
      description: "We'll respond within 24 hours",
      color: "violet"
    },
    {
      icon: MapPin,
      title: "Location",
      content: "San Francisco, CA",
      description: "Remote-first team",
      color: "fuchsia"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri 9AM-6PM PST",
      description: "Support available 24/7",
      color: "purple"
    }
  ];

  const socialLinks = [
    { icon: Twitter, label: "Twitter", href: "#", username: "@oneroute" },
    { icon: Linkedin, label: "LinkedIn", href: "#", username: "oneroute" },
    { icon: Github, label: "GitHub", href: "#", username: "oneroute" }
  ];

  const faqs = [
    { q: "How do I add an application?", a: "Click the '+' button on your dashboard" },
    { q: "Can I export my data?", a: "Yes, go to Settings > Export Data" },
    { q: "Is OneRoute free?", a: "Yes! OneRoute is completely free for students" }
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900"
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: "1s" }} />
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 relative">
        <Link href="/" className="flex items-center gap-2 group w-fit">
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
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 backdrop-blur-xl mb-4">
            <MessageSquare className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            We'd Love to{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Hear From You
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${
            theme === "dark" ? "text-slate-300" : "text-slate-600"
          }`}>
            Have questions? Feedback? Just want to say hi? Drop us a message and we'll get back to you soon.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon;
            return (
              <div
                key={idx}
                className={`group rounded-2xl p-6 border backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:shadow-violet-500/20"
                    : "bg-white/80 border-slate-200/50 hover:bg-white hover:shadow-violet-600/10"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"
                    : "bg-gradient-to-br from-violet-100 to-fuchsia-100"
                }`}>
                  <Icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                <p className="font-semibold text-violet-600 mb-1">{info.content}</p>
                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  {info.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-3xl p-8 md:p-10 border backdrop-blur-xl shadow-2xl ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700/50 shadow-violet-500/20"
                  : "bg-white/80 border-slate-200/50 shadow-violet-600/10"
              }`}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
                <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                  Fill out the form below and we'll respond as soon as possible
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}>
                    Your Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`} />
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="John Doe"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                        theme === "dark"
                          ? "bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                          : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                      } ${errors.name ? "border-red-500 focus:ring-red-500/50" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`} />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                        theme === "dark"
                          ? "bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                          : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                      } ${errors.email ? "border-red-500 focus:ring-red-500/50" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}>
                    Message
                  </label>
                  <textarea
                    {...register("message")}
                    placeholder="Tell us more about your question or feedback..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none ${
                      theme === "dark"
                        ? "bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    } ${errors.message ? "border-red-500 focus:ring-red-500/50" : ""}`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - FAQs & Social */}
          <div className="space-y-6">
            {/* Quick FAQs */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-xl ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700/50"
                  : "bg-white/80 border-slate-200/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-violet-600" />
                <h3 className="text-lg font-bold">Quick Answers</h3>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-sm mb-1">{faq.q}</h4>
                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                      {faq.a}
                    </p>
                    {idx < faqs.length - 1 && (
                      <div className={`mt-4 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-xl ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700/50"
                  : "bg-white/80 border-slate-200/50"
              }`}
            >
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <p className={`text-sm mb-4 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Follow us on social media for updates
              </p>
              <div className="space-y-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 group ${
                        theme === "dark"
                          ? "bg-slate-900/50 border-slate-700 hover:bg-slate-900"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        theme === "dark"
                          ? "bg-slate-800 group-hover:bg-violet-500/20"
                          : "bg-slate-100 group-hover:bg-violet-100"
                      } transition-colors duration-300`}>
                        <Icon className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{social.label}</div>
                        <div className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                          {social.username}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Support Badge */}
            <div className={`rounded-2xl p-6 border backdrop-blur-xl ${
              theme === "dark"
                ? "bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/20"
                : "bg-gradient-to-br from-violet-50 to-fuchsia-50 border-violet-200"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-violet-600" />
                <h3 className="text-lg font-bold">24/7 Support</h3>
              </div>
              <p className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                Our support team is always here to help you succeed in your job search journey.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
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
  );
}