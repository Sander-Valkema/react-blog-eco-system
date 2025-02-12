import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        dirs: ['src']
    },
    webpack: (config) => {
        config.module.rules = [
            ...config.module.rules,
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            }
        ];

        return config;
    }
};

export default nextConfig;
