/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_S3_URL,
                port: ''
            }
        ]
    },
    compiler: {
        removeConsole:
        process.env.NODE_ENV === 'production' ? {
            exclude: ['error']
        } : false,
    }
};

export default nextConfig;
