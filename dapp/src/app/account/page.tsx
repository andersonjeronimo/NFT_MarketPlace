"use client"

import React from "react";
import { useEffect, useState } from "react";
import { loadMyNFTs, NFTDetail } from "@/services/Web3Service";
import Card from "@/components/card";

function Account() {

    const [nfts, setNft] = useState<NFTDetail[]>([]);
    const [message, setMessage] = useState<string>("Loading your NFTs...");

    useEffect(() => {
        loadMyNFTs()
            .then(nfts => {
                setMessage(`${nfts.length} NFT(s) loaded successfully!`);
                setNft(nfts);
            })
            .catch(err => setMessage(err.message))
    }, [])

    return (
        <section className="bg-secondary-500 py-24 text-gray-400 sm:px-4">
            <div className="container mx-auto px-4">
                <div className="-mx-4 flex flex-wrap gap-2 items-center mb-6">
                    <div className="px-4 w-full md:flex-1">
                        <h2 className="capitalize font-bold text-3xl text-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em" className="inline-block mb-2 mr-2 text-primary-500">
                            <path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z"></path>
                        </svg><span>My NFTs</span></h2>
                    </div>
                </div>
                <div className="-mx-3 flex flex-wrap gap-y-6 justify-center mb-12">
                    {
                        nfts && nfts.length ? nfts.map(nft => <Card nft={nft} sold={true} />) : <>No NFTs found for this user</>
                    }
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

export default Account;