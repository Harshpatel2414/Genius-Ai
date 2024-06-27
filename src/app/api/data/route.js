import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import fs from "fs"
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
    apiKey: '8b7c1ed9-805d-4cba-b377-2c5bcbb92f5d'
});

const index = pc.Index("french");

const genAI = new GoogleGenerativeAI("AIzaSyAc6eCSa_BadNsrEbKYPCQhtUQVIO_aoY0");
const mongoURI = process.env.MONGO_URI

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

export const GET = async (req, res) => {
    try {
    
        const productsData = fs.readFileSync("DATA/French_Store.json", 'utf-8');
        const products = JSON.parse(productsData);

        const upsertRequests = products.map(async (product) => {
            
                const embedDTagsVector = await embeddingModel.embedContent(product.tags);
                const tagsEmbedding = embedDTagsVector.embedding.values;

                return {
                    id: product.id.toString(),
                    values: tagsEmbedding,
                    metadata: {
                        title: product.title,
                        price: product.variants ? parseFloat(product.variants[0].price) : parseFloat(product.price),
                        product_type: product.product_type,
                        discription: product.body_html,
                        vendor: product.vendor,
                        tags: product.tags
                    }
                };
        });

        const vectors = await Promise.all(upsertRequests);
        
        await index.upsert(vectors);

        return NextResponse.json(vectors, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}



//new code here for upload doc in mongodb with embedding 


// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { MongoClient } from "mongodb";
// import { NextResponse } from "next/server";
// import fs from "fs"
// import { Pinecone } from '@pinecone-database/pinecone';

// const pc = new Pinecone({
//     apiKey: '8b7c1ed9-805d-4cba-b377-2c5bcbb92f5d'
// });

// const index = pc.Index("tech");

// const genAI = new GoogleGenerativeAI("AIzaSyAc6eCSa_BadNsrEbKYPCQhtUQVIO_aoY0");
// const mongoURI = process.env.MONGO_URI

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

// export const GET = async (req, res) => {
//     try {
//         const client = new MongoClient(mongoURI)
//         client.connect()
//         const db = client.db("products")
//         const collection = db.collection("products")

//         const productsData = fs.readFileSync("DATA/Products.json", 'utf-8');
//         const products = JSON.parse(productsData);

//         const upsertRequests = products.map(async (product) => {
//             const embedDTagsVector = await embeddingModel.embedContent(product.tags);

//             const tagsEmbedding = embedDTagsVector.embedding.values;

//             return { embedding: tagsEmbedding, ...product };
//         });

//         const data = await Promise.all(upsertRequests);

//         const res = await collection.insertMany(data)
//         return NextResponse.json(res, { status: 200 })
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 })
//     }
// }