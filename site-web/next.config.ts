import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    //app android
    /*
    output: 'export',
    trailingSlash: true,
    basePath: '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
    distDir: '.next',
     */

    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                port: '',
                pathname: '/api/**',
            },
        ],
    },
};

export default nextConfig;