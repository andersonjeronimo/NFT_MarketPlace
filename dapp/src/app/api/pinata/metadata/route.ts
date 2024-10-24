import axios from "axios";
import { Metadata } from "@/services/Web3Service";

async function pinJSONToIPFS(metadata: Metadata): Promise<string> {
    //ver Pinata Docs https://docs.pinata.cloud/web3/pinning/pinning-files
    const pinataMetadata = JSON.stringify({
        name: metadata.name
    });

    const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: {
            "pinataContent": metadata,
            "pinataMetadata": pinataMetadata
        },
        headers: {
            "pinata_api_key": `${process.env.API_KEY}`,
            "pinata_secret_api_key": `${process.env.API_SECRET}`,
            "Content-Type": "application/json"
        }
    });

    return `${response.data.IpfsHash}`;
}

export async function POST(request: Request) {
    const metadata = await request.json();
    const uri = await pinJSONToIPFS(metadata);
    return Response.json({ uri });
}