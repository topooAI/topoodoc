import { createMDX } from "fumadocs-mdx/next";
import { fileURLToPath } from "node:url";

const config = {
  reactStrictMode: true,
  output: "export",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)),
  transpilePackages: ["@topoo/fumadocs-system"],
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX();

export default withMDX(config);
