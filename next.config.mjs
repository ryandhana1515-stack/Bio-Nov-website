/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/eclipse', destination: '/eclipse/index.html', permanent: false },
    ];
  },
};

export default nextConfig;
