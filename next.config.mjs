/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Reescribir URLs con .js para que funcionen con el route handler
  async rewrites() {
    return [
      {
        source: '/p/:id.js',
        destination: '/p/:id',
      },
    ];
  },
  
  // Configurar headers CORS para el endpoint público de scripts
  async headers() {
    return [
      {
        source: '/p/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },
};

export default nextConfig;
