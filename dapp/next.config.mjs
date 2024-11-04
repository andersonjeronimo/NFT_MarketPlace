/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MARKETPLACE_ADDRESS: process.env.MARKETPLACE_ADDRESS,
        COLLECTION_ADDRESS: process.env.COLLECTION_ADDRESS,
        CHAIN_ID: process.env.CHAIN_ID
    },
    images: {
        domains: [
            "yellow-wonderful-vulture-357.mypinata.cloud",
            "images.unsplash.com"
        ]
    }
};

export default nextConfig;
