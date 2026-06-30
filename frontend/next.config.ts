import type { NextConfig } from "next";

// Loosen a few directives in development so Next.js HMR / fast-refresh (which
// uses eval + a websocket) keeps working. Production gets the tighter policy.
const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy.
// Notes on why each directive is what it is for THIS app:
// - style-src needs 'unsafe-inline': the whole UI is inline style={{...}} plus a
//   <style> tag in page.tsx. Removing this would break every screen.
// - script-src needs 'unsafe-inline' for Next's hydration scripts; 'unsafe-eval'
//   is dev-only (HMR). Tighten to nonces later if we want stricter script CSP.
// - connect-src must allow Supabase (REST over https + realtime over wss). The
//   wildcard covers any project ref without hardcoding it.
// - frame-ancestors 'none' + object-src 'none' block clickjacking / plugins.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co${isDev ? " ws:" : ""}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  // Force HTTPS for two years (ignored on http://localhost, applied once on a
  // real HTTPS domain). No `preload` yet — that's a hard-to-undo commitment.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Content-Security-Policy", value: csp },
  // Stop browsers from MIME-sniffing responses into a different content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs (incl. zip in query strings) to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Belt-and-suspenders with CSP frame-ancestors: no embedding in iframes.
  { key: "X-Frame-Options", value: "DENY" },
  // Disable powerful browser features the app doesn't use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply the security headers to every route.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
