/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    swcMinify: true,

    async rewrites() {
        return [{
            source: "/api/:path*",
            // Change to your backend URL in production
            destination: "https://cotalkbackend-concord.app.secoder.net/api/:path*",
        },{
            source: "/ws/chat/:path*",
            // Change to your backend URL in production
            destination: "wws://cotalkbackend-concord.app.secoder.net/ws/chat/:path*",
        }];
    }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;

