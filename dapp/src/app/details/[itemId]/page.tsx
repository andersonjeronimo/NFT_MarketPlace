"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadDetails, buyNFT, NFTDetail } from "@/services/Web3Service";
import Image from "next/image";
import Link from "next/link";

function Details() {
    const params = useParams();

    const [nft, setNft] = useState<NFTDetail>({} as NFTDetail);
    const [message, setMessage] = useState<string>("Messages...");

    const placeholderImg = "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixid=MnwyMDkyMnwwfDF8c2VhcmNofDQxfHxhcnQlMjBnYWxsZXJ5fGVufDB8fHx8MTYzNjUwNTg4OA&ixlib=rb-1.2.1q=85&fm=jpg&crop=faces&cs=srgb&w=600&h=600&fit=crop";

    useEffect(() => {
        setMessage("Loading details...");
        loadDetails(Number(params.itemId))
            .then(nft => {
                setMessage(`${nft.name} loaded successfully!`);
                setNft(nft);
            })
            .catch(err => setMessage(err.message))
    }, [params.itemId])

    function btnBuyClick() {
        if (!nft) {
            return;
        }
        setMessage(`Sendind your buy request to blockchain...wait...`);
        buyNFT(nft)
            .then(buyerAddress => setMessage(`NFT acquired by ${buyerAddress} successfully!`))
            .catch(err => setMessage(err.message));
    }

    return (
        <section className="bg-secondary-500 py-24 text-gray-400 sm:px-4">
            <div className="container mx-auto pb-36 pt-16 px-4 relative">
                <div className="-mx-4 flex flex-wrap items-center space-y-6 lg:space-y-0">
                    <div className="px-4 w-full lg:w-6/12 xl:w-5/12">
                        <div className="bg-secondary-500 p-4 rounded-2xl w-10/12 sm:p-6 md:w-7/12 lg:w-full">
                            <Link href={nft.itemId ? "/details/" + nft.itemId : "#"} className="block group overflow-hidden relative rounded-xl">
                                <Image src={nft.image ? `https://yellow-wonderful-vulture-357.mypinata.cloud/ipfs/${nft.image}` : placeholderImg} className="w-full" alt="The NFT image" width="600" height="600" />
                                <div className="absolute bg-opacity-10 bg-white bottom-0 flex group-hover:bg-opacity-20 inset-x-0 items-center justify-between p-4 text-white sm:px-6">
                                    <h2 className="font-bold text-black">{nft.name || "Loading..."}</h2>
                                    <span className="italic text-black opacity-50">by {nft.description || "Loading..."}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="mx-auto px-4 w-full lg:w-6/12">
                        <h1 className="font-bold leading-tight mb-2 text-4xl text-white md:leading-tight md:text-5xl lg:leading-tight lg:text-6xl 2xl:leading-tight 2xl:text-7xl">{nft.name || "Loading..."}</h1>
                        <p className="font-light mb-12 text-xl">by {nft.description || "Loading..."}</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <button type="button" onClick={btnBuyClick} className="bg-gradient-to-t bg-primary-500 font-bold from-primary-500 hover:bg-primary-600 hover:from-primary-600 hover:to-primary-500 inline-block px-12 py-2 rounded text-white to-primary-400">Buy</button>
                        </div>
                    </div>
                </div>
            </div>
            {
                message ?
                    <div className="block w-full">
                        <div className="font-regular relative mt-4 block w-full rounded-lg bg-gray-700 p-4 text-base leading-5 text-white opacity-100">{message}</div>
                    </div>
                    : <></>
            }
        </section>
    )

}

export default Details;