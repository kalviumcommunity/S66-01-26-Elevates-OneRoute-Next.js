import type { NextConfig } from "next";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "https://oneroute.app";
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL || APP_DOMAIN;

const buildContentSecurityPolicy = () => {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "object-src 'none'",
    `connect-src 'self' ${API_DOMAIN} ${APP_DOMAIN}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "upgrade-insecure-requests",
  ];

  const scriptSrc = ["script-src", "'self'"];
  if (process.env.NODE_ENV !== "production") {
    scriptSrc.push("'unsafe-eval'", "'unsafe-inline'");
  }
  directives.push(scriptSrc.join(" "));

  return directives.join("; ");
};

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: buildContentSecurityPolicy(),
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
