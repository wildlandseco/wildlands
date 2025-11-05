// next.config.mjs
const nextConfig = {
  experimental: {
    turbo: { resolveExtensions: [".mdx", ".md", ".tsx", ".ts", ".jsx", ".js"] },
  },
};

export default nextConfig;
