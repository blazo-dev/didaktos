const nextConfig = {
    eslint: {
        // Temporarily disable ESLint during builds
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Enable TypeScript checking during builds
        ignoreBuildErrors: false,
    },
};

export default nextConfig;
