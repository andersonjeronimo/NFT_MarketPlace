"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadDetails, NFTDetail } from "@/services/Web3Service";

function Details() {
    const params = useParams();

    const [nft, setNft] = useState<NFTDetail>({} as NFTDetail);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        loadDetails(Number(params.itemId))
            .then(nft => setNft(nft))
            .catch(err => setMessage(err.message))
    }, [params.itemId])

    return (
        <section className="bg-secondary-500 py-24 text-gray-400 sm:px-4">
            <div className="container mx-auto px-4">
                <p>{require("util").inspect(nft)}</p>
            </div>
            {
                message ?
                    <p className="font-bold mt-5">{message}</p>
                    : <></>
            }
        </section>
    )

}

export default Details;