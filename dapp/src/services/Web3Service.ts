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

export type Metadata = {
    name?: string;
    description?: string;
    image?: string;
}

async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios({
        method: "POST",
        url: "/api/pinata/file",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
    });

    return `${response.data.uri}`;
}

async function uploadMetadata(metadata: Metadata): Promise<string> {
    const response = await axios({
        method: "POST",
        url: "/api/pinata/metadata",
        data: metadata,
        headers: { "Content-Type": "application/json" }
    });

    return `${response.data.uri}`;
}

export async function createAndUpload(nft: NFT): Promise<number> {
    if (!nft.description || !nft.image || !nft.name || !nft.price) {
        throw new Error("All fields are required.");
    }

    //upload da imagem
    const uri = await uploadFile(nft.image);
    console.log(uri);
    //criação dos metadatos
    const metadataUri = await uploadMetadata({ name: nft.name, description: nft.description, image: uri });
    console.log(metadataUri);
    //mint da NFT
    //criação do market item

    const tokenID = 1;
    return tokenID;
}