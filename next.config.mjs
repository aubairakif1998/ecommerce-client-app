/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"], // Use 'domains' instead of 'domain'
  },
};

export default nextConfig;
