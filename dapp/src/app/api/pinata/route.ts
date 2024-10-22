import axios from "axios";

async function pinFileToIPFS(formData: FormData): Promise<string> {
    //ver Pinata Docs https://docs.pinata.cloud/web3/pinning/pinning-files
    /* const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
            "pinata_api_key": `${process.env.API_KEY}`,
            "pinata_secret_api_key": `${process.env.API_SECRET}`,
            "Content-Type": "multipart/form-data"
        }
    }); */

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
            headers: {
                "pinata_api_key": `${process.env.API_KEY}`,
                "pinata_secret_api_key": `${process.env.API_SECRET}`,
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return `${response.data.IpfsHash}`;
}

/* const JWT = `${process.env.JWT}`;

async function pinFileToIPFS(formData: FormData) {
    try {
        const file = new File(["hello"], "Testing.txt", { type: "text/plain" });
        formData.append("file", file);

        const pinataMetadata = JSON.stringify({
            name: "File name",
        });
        formData.append("pinataMetadata", pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 1,
        });
        formData.append("pinataOptions", pinataOptions);

        const response = await axios({
            method: "POST",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
                Authorization: `Bearer ${JWT}`
            }
        });
        return `${response.data.IpfsHash}`;

    } catch (error) {
        console.log(error);
    }
} */


export async function POST(request: Request) {
    const formData = await request.formData();
    const uri = await pinFileToIPFS(formData);
    return Response.json({ uri });
}