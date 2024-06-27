import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

const mongoURI = process.env.MONGO_URI

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const index = pc.Index("products");

async function fetchUniqueCategories(client) {
    const db = client.db("products");
    const collection = db.collection("Products");

    const allTags = await collection.distinct("tags");
    const uniqueTags = new Set();

    allTags.forEach(tags => {
        tags.split(',').forEach(tag => {
            uniqueTags.add(tag.trim());
        });
    });

    return Array.from(uniqueTags);
}

async function getModelResponse(prompt) {
    const result = await model.generateContent(prompt);
    const parts = result.response.candidates[0]?.content?.parts;
    const content = parts ? parts.map(part => part.text).join(' ') : '';
    return content;
}

export const POST = async (req) => {
    try {
        const { query } = await req.json();
        const client = new MongoClient(mongoURI);
        await client.connect();

        // Fetch all unique categories
        const uniqueCategories = await fetchUniqueCategories(client);

        // Analyze the user's query to extract relevant categories, brand names, and price range
        const initialPrompt = `
        You are an intelligent assistant. Your job is to understand the user's query and identify relevant product categories, brand names, and price range.

        Follow these step-by-step instructions to analyze the query:
            1. Read the user's query carefully: "${query}".
            2. Identify keywords or phrases that indicate the type of products the user is searching for. These may include product categories like smartphones, laptops, etc.
            3. Identify any brand names mentioned in the query such as Apple, Samsung, etc.
            4. Identify any price range mentioned in the query, such as "under $1000".
            5. Match the identified keywords with available product categories and brands: ${uniqueCategories.join(", ")}.
            6. Provide a comma-separated list of relevant categories, brand names, and price range based on the user's query.
            
            Provide your response below:
            `;

        const initialResponse = await getModelResponse(initialPrompt);
        const relevantInfo = initialResponse.split(',').map(item => item.trim());
        console.log("Relevant Categories, Brands, and Price Range >>>", relevantInfo);

        // Extract price range if specified
        let priceFilter = null;
        relevantInfo.forEach(info => {
            const priceMatch = info.match(/under \$(\d+)/);
            if (priceMatch) {
                priceFilter = parseFloat(priceMatch[1]);
            }
        });
        console.log("price >>", priceFilter)
        // Fetch unique tags from the database and filter based on relevant categories and brands
        const collection = client.db("products").collection("Products");
        const allTags = await collection.distinct("tags");
        const matchingTags = new Set();

        allTags.forEach(tags => {
            tags.split(',').forEach(tag => {
                if (relevantInfo.includes(tag.trim())) {
                    matchingTags.add(tag.trim());
                }
            });
        });

        const matchingTagsArray = Array.from(matchingTags);
        console.log("Matching Tags >>>", matchingTagsArray);

        // Combine relevant categories and matching tags into a single query string
        const combinedQuery = [...relevantInfo, ...matchingTagsArray].join(", ");

        // Get the query embedding
        const queryEmbedding = await embeddingModel.embedContent(combinedQuery);
        const queryVector = queryEmbedding.embedding.values;

        // Fetch matching IDs from Pinecone
        const data = await index.query({
            vector: queryVector,
            filter: priceFilter !== null ? { price: { "$lte": priceFilter } } : undefined,
            topK: 5
        });

        const ids = data ? data.matches.map(item => parseInt(item.id)) : [];
        console.log("ids >>", ids);

        // Fetch documents from the database based on the constructed query
        const documents = await collection.find({ id: { $in: ids } }).toArray();

        // Filter documents by price if priceFilter is specified
        let filteredDocuments = documents;
        if (priceFilter !== null) {
            filteredDocuments = documents.filter(doc =>
                doc.variants.some(variant => parseFloat(variant.price) <= priceFilter)
            );
        }

        await client.close();
        return NextResponse.json({ data: filteredDocuments }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

// export const POST = async (req) => {
//     try {
//         const { query } = await req.json();
//         const client = new MongoClient(mongoURI)
//         await client.connect()
//         const db = client.db("products")
//         const collection = db.collection("Products")

//         const allTags = await collection.distinct("tags");
//         console.log("allTags >>>", allTags);
//         const categories = new Set();

//         allTags.forEach(tags => {
//             tags.split(',').forEach(tag => {
//                 categories.add(tag.trim());
//             });
//         });

//         const queryEmbedding = await embeddingModel.embedContent(query);
//         const queryVector = queryEmbedding.embedding.values;

//         const data = await index.query({
//             vector: queryVector,
//             topK: 5
//         });

//         const ids = data ? data.matches.map(item => parseInt(item.id)) : [];
//         const documents = await collection.find({ id: { $in: ids } }).toArray();
//         await client.close()
//         return NextResponse.json({ data: documents }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// };