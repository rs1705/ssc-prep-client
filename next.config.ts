import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hosts allowed to load dev resources (HMR) — e.g. a phone on the same Wi-Fi.
  // Dev-only; ignored in production builds.
  allowedDevOrigins: ["192.168.1.38"],
};

export default nextConfig;
