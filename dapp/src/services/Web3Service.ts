import axios from "axios";

import { ethers, EventLog } from "ethers";
import NFTCollectionABI from "./NFTCollection.abi.json";
import NFTMarketABI from "./NFTMarket.abi.json";

const MARKETPLACE_ADDRESS = `${process.env.MARKETPLACE_ADDRESS}`;
const COLLECTION_ADDRESS = `${process.env.COLLECTION_ADDRESS}`;
const CHAIN_ID = `${process.env.CHAIN_ID}`;

export type NFT = {
    name?: string;
    description?: string;
    price?: string;
    image?: File;
}

export type NFTDetail = {
    itemId: number;
    tokenId: number;
    price: bigint | string;
    seller: string;
    owner: string;
    image: string;
    name: string;
    description: string;
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

async function getProvider() {
    if (!window.ethereum) { throw new Error(`Wallet not found!`) };
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts: string[] = await provider.send("eth_requestAccounts", []);
    if (!accounts || !accounts.length) {
        throw new Error(`Wallet not permitted!`);
    }
    await provider.send("wallet_switchEthereumChain", [{
        chainId: ethers.toQuantity(CHAIN_ID)
    }]);
    return provider;
}

async function createItem(url: string, price: string): Promise<number> {
    const provider = await getProvider();
    const signer = await provider.getSigner();

    //mint NFT
    const collectionContract = new ethers.Contract(COLLECTION_ADDRESS, NFTCollectionABI, signer);
    const mintTx = await collectionContract.mint(url);
    //o recibo da transação é um log do evento que é disparado após essa transação
    // ver https://eips.ethereum.org/EIPS/eip-721
    const mintTxReceipt: ethers.ContractTransactionReceipt = await mintTx.wait();
    //let eventLog = mintTxReceipt.logs[0] as EventLog;
    let eventLog = mintTxReceipt.logs.find(log => (log as EventLog).eventName === "Transfer") as EventLog;
    const tokenId = Number(eventLog.args[2]);
    /* event Transfer(
    address indexed _from, 
    address indexed _to, 
    uint256 indexed _tokenId <----[index 2]
    ); */

    //create market item
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, NFTMarketABI, signer);
    const weiPrice = ethers.parseUnits(price, "ether");
    const listingPrice = (await marketContract.listingPrice()).toString();
    const createTx = await marketContract.createMarketItem(COLLECTION_ADDRESS, tokenId, weiPrice, { value: listingPrice });
    //o recibo da transação contém, dentre outras infos, os logs dos eventos disparados após essa transação
    const createTxReceipt: ethers.ContractTransactionReceipt = await createTx.wait();
    //eventLog = createTxReceipt.logs[0] as EventLog;
    eventLog = createTxReceipt.logs.find(log => (log as EventLog).eventName === "MarketItemCreated") as EventLog;
    const itemId = Number(eventLog.args[0]);
    /* event MarketItemCreated(
        uint indexed itemId,<----[index 0]
        address indexed nftContract,
        uint indexed tokenId,
        address seller,
        uint price
    ); */
    return itemId;
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
    //mint da NFT & criação do market item
    const itemId = await createItem(metadataUri, nft.price);
    return itemId;
}

export async function loadDetails(itemId: number): Promise<NFTDetail> {
    const provider = await getProvider();
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, NFTMarketABI, provider);
    const collectionContract = new ethers.Contract(COLLECTION_ADDRESS, NFTCollectionABI, provider);

    //TODO: mapping marketItems deve ser PUBLIC [OK]
    const item: NFTDetail = await marketContract.marketItems(itemId);
    //mapping(uint => MarketItem) marketItems; // itemId => market item    
    if (!item) {
        return {} as NFTDetail;
    }

    const tokenUri = await collectionContract.tokenURI(item.tokenId);
    // gateway: yellow-wonderful-vulture-357.mypinata.cloud + CID (tokenUri)
    const metadata = await axios.get(`https://yellow-wonderful-vulture-357.mypinata.cloud/ipfs/${tokenUri}`);
    const price = ethers.formatUnits(item.price.toString(), "ether");

    return {
        itemId: item.itemId,
        tokenId: item.tokenId,
        price: price,
        seller: item.seller,
        owner: item.owner,
        image: metadata.data.image,
        name: metadata.data.name,
        description: metadata.data.description
    } as NFTDetail;

}

export async function buyNFT(nftDetail: NFTDetail): Promise<string> {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const contrat = new ethers.Contract(MARKETPLACE_ADDRESS, NFTMarketABI, signer);
    const price = ethers.parseUnits(nftDetail.price.toString(), "ether");
    const createTx = await contrat.createMarketSale(COLLECTION_ADDRESS, nftDetail.itemId, { value: price });
    const createTxReceipt: ethers.ContractTransactionReceipt = await createTx.wait();
    let eventLog = createTxReceipt.logs.find(log => (log as EventLog).eventName === "MarketItemCreated") as EventLog;
    const sellerAddress = eventLog.args[3];
    /* event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContract,
        uint indexed tokenId,
        address seller,
        uint price
    ); */
    return sellerAddress;
}

export async function loadMyNFTs(): Promise<NFTDetail[]> {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, NFTMarketABI, provider);
    const collectionContract = new ethers.Contract(COLLECTION_ADDRESS, NFTCollectionABI, provider);

    //a função não espera parâmetros no contrato, porém, é possível passar um endereço de carteira...
    //...que será considerado como sendo o owner
    const data = await marketContract.fetchMyOwnedItems({ from: signer.address });

    if (!data || !data.length) {
        return [];
    }

    const items: NFTDetail[] = await Promise.all(data.map(async (item: NFTDetail) => {
        const tokenUri = await collectionContract.tokenURI(item.tokenId);
        // gateway: yellow-wonderful-vulture-357.mypinata.cloud + CID (tokenUri)
        const metadata = await axios.get(`https://yellow-wonderful-vulture-357.mypinata.cloud/ipfs/${tokenUri}`);
        const price = ethers.formatUnits(item.price.toString(), "ether");
        return {
            itemId: item.itemId,
            tokenId: item.tokenId,
            price: price,
            seller: item.seller,
            owner: item.owner,
            image: metadata.data.image,
            name: metadata.data.name,
            description: metadata.data.description
        } as NFTDetail;
    }));

    return items;
}