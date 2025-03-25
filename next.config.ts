import path from 'path';

const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: '/product_app_test',
  assetPrefix: '/product_app_test/',
  images: {
    unoptimized: true
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../')
  }
}

export default nextConfig;