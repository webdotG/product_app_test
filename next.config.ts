const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/product_app_test' : '',
  reactStrictMode: true,
  
  // Только для development-режима
  headers: async () => {
    if (process.env.NODE_ENV === 'development') {
      return [{
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline';"
          }
        ]
      }]
    }
    return []
  },
  
  images: {
    unoptimized: true
  }
}