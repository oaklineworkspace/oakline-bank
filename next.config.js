/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure development server for Replit
  devIndicators: {
    buildActivity: false
  },
  // Additional settings for Replit environment
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
