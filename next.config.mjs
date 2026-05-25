/** @type {import('next').NextConfig} */
const nextConfig = {
  // Native module used by the SQLite persistence layer (local / Node runtime).
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

export default nextConfig;
