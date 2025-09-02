/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 抑制由于浏览器扩展导致的SSR警告
  onDemandEntries: {
    // 减少开发时的内存使用
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
