import { createMDX } from "fumadocs-mdx/next";

const config = {
  reactStrictMode: true,
  output: "export",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  transpilePackages: ["@topoo/fumadocs-system"],
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX();

export default withMDX(config);
