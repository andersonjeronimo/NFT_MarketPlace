import { NFTDetail } from "@/services/Web3Service";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type Props = {
    nft: NFTDetail,
    sold?: boolean
}

function Card(props: Props) {
    return (
        <div className="px-3 w-full md:w-6/12 lg:w-4/12">
            <div className="bg-opacity-10 bg-white overflow-hidden rounded-xl text-gray-500">
                <Link href={`/details/${props.nft.itemId}`} className="block group relative">
                    <Image src={`https://yellow-wonderful-vulture-357.mypinata.cloud/ipfs/${props.nft.image}`} className="group-hover:opacity-90 w-full" alt="..." width="600" height="600" />
                </Link>
                <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xl">
                            <Link href={`/details/${props.nft.itemId}`} className="hover:text-primary-100 text-white">{props.nft.name}</Link>
                        </h3>
                    </div>
                    <hr className="my-4 opacity-20" />
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href={`/details/${props.nft.itemId}`} className="hover:text-gray-500 inline-flex italic items-center space-x-2 text-gray-400 text-sm">
                                <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixid=MXwyMDkyMnwwfDF8c2VhcmNofDE5fHxkb2d8ZW58MHx8fA&ixlib=rb-1.2.1q=85&fm=jpg&crop=faces&cs=srgb&w=400&h=400&fit=crop" className="border-4 border-white rounded-full" alt="..." width="36" height="36" />
                                <span>Owned by {props.nft.description}</span>
                            </Link>
                        </div>
                        {
                            !props.sold ?
                                <div>
                                    <Link href={`/details/${props.nft.itemId}`} className="group inline-block text-white"> <p className="group-hover:text-primary-100 mb-1 text-gray-400 text-sm">Buy Now</p>
                                        <span className="font-bold font-serif text-xl"> POL$ {props.nft.price.toString().substring(0, 4)}</span>
                                    </Link>
                                </div>
                                :
                                <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card;