import { Pinecone } from '@pinecone-database/pinecone';

const searchProducts = async (queryVector, priceFilter, store) => {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    let storeIndex = process.env.INDEX;
    if (store === "Tech_Store") {
        storeIndex = "tech"
    } else if (store === "Cloth_Store") {
        storeIndex = "cloths"
    } else {
        storeIndex = process.env.INDEX
    }
   
    const index = pc.Index(storeIndex);
    const data = await index.query({
        vector: queryVector,
        filter: priceFilter !== null ? { price: { "$lte": priceFilter } } : undefined,
        topK: 5
    });

    const ids = data ? data.matches.map(item => parseInt(item.id)) : [];
    return ids;
}

export default searchProducts