"use client"

import { useParams } from "next/navigation";

function Details() {
    const params = useParams();
    return(
        <section className="bg-secondary-500 py-24 text-gray-400 sm:px-4">
            <p>Details item ID: {params.itemId}</p>
        </section>        
    )
    
}

export default Details;