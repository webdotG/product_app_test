/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/product_app_test' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/product_app_test/' : '',
}

module.exports = nextConfig