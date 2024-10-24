import axios from "axios";

async function pinFileToIPFS(formData: FormData): Promise<string> {
    //ver Pinata Docs https://docs.pinata.cloud/web3/pinning/pinning-files
    const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
            "pinata_api_key": `${process.env.API_KEY}`,
            "pinata_secret_api_key": `${process.env.API_SECRET}`,
            "Content-Type": "multipart/form-data"
        }
    }); 

    return `${response.data.IpfsHash}`;
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const uri = await pinFileToIPFS(formData);
    return Response.json({ uri });
}