import { NextResponse } from "next/server";

import fetchInitialPrompt from "@/helpers/fetchInitialPrompt";
import fetchPromptWithCategories from "@/helpers/fetchPromptWithCategories";
import getModelResponse from "@/utils/getModelResponse";
import fetchPromptWithNoProducts from "@/helpers/fetchPromptWithNoProducts";
import fetchProductDetails from "@/utils/fetchProductDetails";
import getFilteredProducts from "@/utils/getFilteredProducts";
import fetchPromptWithProducts from "@/helpers/fetchPromptWithProducts";
import fetchGeneralPrompt from "@/helpers/fetchGeneralPrompt";
import fetchUniqueCategories from "@/utils/fetchUniqueCategories";
import searchProducts from "@/utils/searchProducts";
import getEmbeddingVector from "@/utils/getEmbeddingVector";

export const POST = async (req) => {
    try {
        const { messages } = await req.json();

        if (!Array.isArray(messages) || messages.length === 0) {
            throw new Error("Invalid input: messages array is required.");
        }

        const lastMessage = messages[messages.length - 1];
        const secondLastMessage = messages.length > 1 ? messages[messages.length - 2] : null;
        const assistantMessage = secondLastMessage && secondLastMessage.role === "assistant" ? secondLastMessage.content : "";

        if (lastMessage.role !== "user") {
            return NextResponse.json({ message: "last message role must be 'user'." }, { status: 500 });
        }

        const query = lastMessage.content;
        const initialResponse = await getModelResponse(fetchInitialPrompt(query, assistantMessage));

        if (initialResponse.toLowerCase().includes('product suggestions needed')) {

            const categories = await fetchUniqueCategories();

            const promptWithCategories = fetchPromptWithCategories(query, categories);
            const modelMessage = await getModelResponse(promptWithCategories);

            const vectorResponse = await getEmbeddingVector(modelMessage);
            const queryVector = vectorResponse.embedding.values;

            const priceMatch = query.match(/under \$(\d+)/);
            const priceFilter = priceMatch ? parseFloat(priceMatch[1]) : null;

            const ids = await searchProducts(queryVector, priceFilter);

            if (ids.length === 0) {
                const content = await getModelResponse(fetchPromptWithNoProducts(query, assistantMessage));

                return NextResponse.json({
                    role: "assistant",
                    content: content
                }, { status: 200 });
            } else {
                const products = await fetchProductDetails(ids);
                const filteredProducts = getFilteredProducts(products);
                console.log("filteredProducts>>", filteredProducts);
                const content = await getModelResponse(fetchPromptWithProducts(filteredProducts, query, assistantMessage));
                console.log("content>>", content);
                return NextResponse.json({
                    role: "assistant",
                    content: content,
                    product_list: filteredProducts
                }, { status: 200 });
            }
        } else {
            const generalResponse = await getModelResponse(fetchGeneralPrompt(query, assistantMessage));
            return NextResponse.json({
                role: "assistant",
                content: generalResponse
            }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};


// export const POST = async (req) => {
//     try {
//         const { query } = await req.json();

//         const client = new MongoClient(mongoURI)
//         client.connect()
//         const db = client.db("products")
//         const collection = db.collection("products")


//         const vectorResponse = await embeddingModel.embedContent(query);
//         const vector = vectorResponse.embedding.values;

//         const results = await collection.aggregate([
//             {
//                 "$vectorSearch": {
//                     "queryVector": vector,
//                     "path": "embedding",
//                     "numCandidates": 768,
//                     "limit": 5,
//                     "index": "products",
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     embedding:0
//                 }
//             }
//         ]).toArray();

//         client.close();
//         return NextResponse.json(results, { status: 200 });


//     } catch (error) {
//         return NextResponse.json({ "error": error.message }, { status: 500 })
//     }

// }