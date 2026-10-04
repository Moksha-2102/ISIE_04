/** @type {import('next').NextConfig} */
if (process.argv.includes("build") || process.env.npm_lifecycle_event === "build") {
  process.env.NODE_ENV = "production";
}

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  transpilePackages: ["three"],
};

export default nextConfig;
