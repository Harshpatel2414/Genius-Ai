import { Pinecone } from '@pinecone-database/pinecone';

const searchProducts = async (queryVector, priceFilter) => {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pc.Index(process.env.INDEX);
    const data = await index.query({
        vector: queryVector,
        filter: priceFilter !== null ? { price: { "$lte": priceFilter } } : undefined,
        topK: 5
    });

    const ids = data ? data.matches.map(item => parseInt(item.id)) : [];
    return ids;
}

export default searchProducts