/** @type {import('next').NextConfig} */

const path = require("path");
const nextConfig = {
  images: { domains: ["ik.imagekit.io", "cdn.pixabay.com", "images.unsplash.com"]},
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
}

module.exports = nextConfig
