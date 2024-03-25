/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputStandalone: true,
  },
  reactStrictMode: false,
  headers: [
    {
      key: 'Access-Control-Allow-Origin',
      value: process.env.NEXT_PUBLIC_APP_URL,
    },
  ],
};

export default nextConfig;
