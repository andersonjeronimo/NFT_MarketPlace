"use client"
import React from "react";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

import { NFT, createAndUpload } from "@/services/Web3Service";

function Create() {

    const [nft, setNft] = useState<NFT>();
    const [message, setMessage] = useState<string>("Message...");

    function onInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
        setNft(prevState => ({ ...prevState, [evt.target.id]: evt.target.value }));
    }

    function onFileChange(evt: React.ChangeEvent<HTMLInputElement>) {
        if (evt.target.files && evt.target.files.length) {
            const file = evt.target.files[0];
            setNft(prevState => ({ ...prevState, image: file }));
        }
    }

    function btnSubmitClick() {
        if (!nft) {
            return;
        }
        setMessage("Sendind your NFT to blockchain...wait...");
        createAndUpload(nft)
            .then(uri => console.log(uri))
            .catch(err => console.log(err));
    }

    //form CSS
    const _inputCSS = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";
    const _labelCSS = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
    const _btnCSS = "bg-gradient-to-t bg-primary-500 font-bold from-primary-500 hover:bg-primary-600 hover:from-primary-600 hover:to-primary-500 inline-block px-12 py-2 rounded text-white to-primary-400";

    return (<>
        <main>
            <section className="bg-secondary-500 poster pt-4 relative text-opacity-60 text-white sm:px-4">
                <Header />
            </section>
            <section className="bg-secondary-500 py-24 text-gray-400 sm:px-4">
                <div className="container mx-auto px-4">
                    <div className="-mx-4 flex flex-wrap gap-2 items-center mb-6">
                        <div className="px-4 w-full md:flex-1">
                            <h2 className="capitalize font-bold text-3xl text-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em" className="inline-block mb-2 mr-2 text-primary-500">
                                <path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z"></path>
                            </svg><span>Create NFT</span></h2>
                        </div>
                    </div>
                    <div>
                        <form>
                            <div className="mb-6">
                                <label htmlFor="name" className={_labelCSS}>Name</label>
                                <input type="text" id="name" value={nft?.name || ''} onChange={onInputChange} className={_inputCSS} />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="description" className={_labelCSS}>Author</label>
                                <input type="text" id="description" value={nft?.description || ''} onChange={onInputChange} className={_inputCSS} />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="price" className={_labelCSS}>Price (POL | MATIC)</label>
                                <input type="number" id="price" value={nft?.price || ''} onChange={onInputChange} className={_inputCSS} />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="image" className={_labelCSS}>Image</label>
                                <input type="file" id="image" onChange={onFileChange} className={_inputCSS} />
                            </div>
                            <button type="button" className={_btnCSS} onClick={btnSubmitClick}>Submit</button>
                            {
                                message ?
                                    <p className="font-bold mt-5">{message}</p>
                                    : <></>
                            }
                            <p>{JSON.stringify(nft)}</p>
                        </form>
                    </div>
                </div>
            </section>
        </main>
        <Footer />
    </>)
}

export default Create;