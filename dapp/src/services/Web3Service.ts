import axios from "axios";
import { ethers } from "ethers";
import NFTCollectionABI from "./NFTCollection.abi.json";
import NFTMarketABI from "./NFTMarket.abi.json";

const MARKETPLACE_ADDRESS = `${process.env.MARKETPLACE_ADDRESS}`;
const COLLECTION_ADDRESS = `${process.env.COLLECTION_ADDRESS}`;

export type NFT = {
    name?: string;
    description?: string;
    price?: string;
    image?: File;
}

async function pinFileToIPFS(file: File, filename: string): Promise<string> {
    try {
        const formData: FormData = new FormData();
        formData.append("file", file);

        const pinataMetadata = JSON.stringify({
            name: filename,
        });
        formData.append("pinataMetadata", pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 1,
        });
        formData.append("pinataOptions", pinataOptions);

        //ver Pinata Docs https://docs.pinata.cloud/web3/pinning/pinning-files
        const response = await axios({
            method: "POST",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: FormData,
            headers: {
                "pinata_api_key": `${process.env.API_KEY}`,
                "pinata_secret_api_key": `${process.env.API_SECRET}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return `ipfs://${response.data.IpfsHash}`;

    } catch (error) {
        console.log(error);
        return "";
    }

}

export async function createAndUpload(nft: NFT): Promise<string> {
    if (!nft.description || !nft.image || !nft.name || !nft.price) {
        throw new Error("All fields are required.");
    }

    //upload da imagem
    const uri = await pinFileToIPFS(nft.image, nft.name);
    return uri;

    //criação dos metadatos
    //mint da NFT
    //criação do market item

    //const tokenID = 1;
    //return tokenID;
}