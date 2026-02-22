const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cqxkhkwzkbonplsfmdcl.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
    experimental: {
        // Cache visited pages in the client-side router for 5 minutes
        // Back/forward navigation will be instant without refetching
        staleTimes: {
            dynamic: 300,  // 5 minutes for dynamic pages
            static: 600,   // 10 minutes for static pages
        },
    },
};

module.exports = withPWA(nextConfig);
