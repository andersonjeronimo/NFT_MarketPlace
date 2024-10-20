/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MARKETPLACE_ADDRESS: process.env.MARKETPLACE_ADDRESS,
        COLLECTION_ADDRESS: process.env.COLLECTION_ADDRESS,
        CHAIN_ID: process.env.CHAIN_ID,
        /* não devem ser expostas aqui
        API_KEY: process.env.API_KEY,
        API_SECRET: process.env.API_SECRET,
        JWT: process.env.JWT */
    }
};

export default nextConfig;
