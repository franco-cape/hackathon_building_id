/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        MAPBOX_API_KEY: process.env.MAPBOX_API_KEY,
        BOSTON_BASE_URL:
            process.env.BOSTON_BASE_URL ||
            "https://boston-rc.cape-integration.com",
    },
};

module.exports = nextConfig;
