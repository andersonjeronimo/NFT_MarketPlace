import React from "react";

function Featured() {
    return (
        <div className="container mx-auto pb-36 pt-16 px-4 relative">
            <div className="-mx-4 flex flex-wrap items-center space-y-6 lg:space-y-0">
                <div className="px-4 w-full lg:w-6/12 xl:w-5/12">
                    <div className="bg-secondary-500 p-4 rounded-2xl w-10/12 sm:p-6 md:w-7/12 lg:w-full"> <a href="#" className="block group overflow-hidden relative rounded-xl"><img src="https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixid=MnwyMDkyMnwwfDF8c2VhcmNofDQxfHxhcnQlMjBnYWxsZXJ5fGVufDB8fHx8MTYzNjUwNTg4OA&ixlib=rb-1.2.1q=85&fm=jpg&crop=faces&cs=srgb&w=600&h=600&fit=crop" className="w-full" alt="..." width="600" height="600" /><div className="absolute bg-opacity-10 bg-white bottom-0 flex group-hover:bg-opacity-20 inset-x-0 items-center justify-between p-4 text-white sm:px-6">
                        <h2 className="font-bold">Digitalized Zeus</h2><span className="italic opacity-50">by Kingsah82</span>
                    </div></a>
                    </div>
                </div>
                <div className="mx-auto px-4 w-full lg:w-6/12">
                    <h1 className="font-bold leading-tight mb-2 text-4xl text-white md:leading-tight md:text-5xl lg:leading-tight lg:text-6xl 2xl:leading-tight 2xl:text-7xl">Discover rare digital arts and collect NFTs</h1>
                    <p className="font-light mb-12 text-xl">World largest marketplace for rarest NFTs.</p>
                    <div className="flex flex-wrap gap-4 items-center">
                        <a href="/create" className="bg-gradient-to-t bg-primary-500 font-bold from-primary-500 hover:bg-primary-600 hover:from-primary-600 hover:to-primary-500 inline-block px-12 py-2 rounded text-white to-primary-400">Create</a>
                    </div>
                </div>
            </div>
        </div>)
}

export default Featured;