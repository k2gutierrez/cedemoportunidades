const { nextImageLoaderRegex } = require('next/dist/build/webpack-config')
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
          {
            protocol: "https",
            hostname: "*",
          },
        ],
      },
      webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback = {
            fs: false,
          }
        }
        return config;
      },
}

module.exports = nextConfig
