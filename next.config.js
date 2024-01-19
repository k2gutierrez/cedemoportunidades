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
}

module.exports = nextConfig
