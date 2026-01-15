/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing configuration options
  reactStrictMode: true,
  swcMinify: true,

  // Updates to be made
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // /** rest of code here **/
};

module.exports = nextConfig;
