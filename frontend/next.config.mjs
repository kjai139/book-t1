/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true'
})

const cspHeader = `
        default-src 'self' https://www.google-analytics.com https://c.disquscdn.com https://disqus.com https://www.googletagmanager.com 'unsafe-inline' tagmanager.google.com;
        connect-src https://links.services.disqus.com 'self' localhost:3000 https://www.google-analytics.com;
        frame-src https://disqus.com https://www.google-analytics.com www.google-analytics.com;
        script-src 'self' ${process.env.NODE_ENV === "production" ? ''  : `'unsafe-eval'` } https://c.disquscdn.com https://52webtoons-com.disqus.com 'unsafe-inline' tagmanager.google.com https://www.googletagmanager.com https://www.google-analytics.com tagmanager.google.com;
        style-src 'self' 'unsafe-inline' https://c.disquscdn.com https://www.googletagmanager.com https://fonts.googleapis.com;
        img-src 'self' blob: data: https://c.disquscdn.com https://referrer.disqus.com https://www.google-analytics.com tagmanager.google.com www.google-analytics.com www.googletagmanager.com https://fonts.gstatic.com https://ds0labvtt9av.cloudfront.net;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_CLOUDFRONT,
                port: ''
            },
            {
                protocol: 'https',
                hostname:  process.env.NEXT_PUBLIC_S3_URL,
                port: ''
            }
        ]
    },
    compiler: {
        removeConsole:
        process.env.NODE_ENV === 'production' ? {
            exclude: ['error']
        } : false,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                  {
                    key: 'Content-Security-Policy',
                    value: cspHeader.replace(/\n/g, ''),
                  },
                ],
              },
        ]
    }
};


export default bundleAnalyzer(nextConfig)
