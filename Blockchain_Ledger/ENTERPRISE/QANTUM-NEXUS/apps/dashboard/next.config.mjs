/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    // Ensuring optimization for the heavy neural visualization
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
