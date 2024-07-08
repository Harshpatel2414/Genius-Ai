import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

const mongoURI = process.env.MONGO_URI;

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const index = pc.Index("products");

function generatePromptWithCategories(query, categories) {
    const categoryList = categories.join(", ");

    const promptTemplate = `You are an intelligent assistant. Your job is to understand the user's query and generate a helpful response.
    
    Step-by-step instructions:
    1. Analyze the user's query: "${query}".
    2. Determine if the user is asking for product suggestions or recommendations.
    3. If the query is about product suggestions, provide a list of recommended products. Use the available product categories for reference: ${categoryList}.
    4. If the query is not about product suggestions, provide a general, friendly response to the user's query.
    5. Ensure the response is clear, concise, and helpful.
    
    Note: If suggesting products, suggest popular products under the specified category and budget if mentioned.
    
    Begin your response below:
    `;

    return promptTemplate;
}

function getInitialPrompt(query) {
    return `You are an intelligent assistant. Your task is to analyze the user's query and determine if they are asking for product suggestions.

    Follow these step-by-step instructions to analyze the query:
    1. Read the user's query carefully: "${query}".
    2. Identify keywords or phrases that indicate the user is asking for product suggestions. These may include words like "recommend", "suggest", "looking for", "best", "options for", etc.
    3. Determine the context of the query to understand if it relates to products. For example, look for mentions of product types, brands, specific features, or price ranges.
    4. Assess if the user's query is seeking advice or information on purchasing or choosing a product.
    
    Based on your analysis, respond with either:
    - "product suggestions needed" if the query involves seeking product recommendations.
    - "general response needed" if the query does not involve seeking product recommendations.

    Provide your response below:`
}

async function fetchResponseWithNoProducts(query) {
    const dynamicPrompt = ` You are an intelligent assistant. The user has searched for products, but none were found that match their query.

        Follow these step-by-step instructions to provide a helpful response:

        1. Analyze the user's query to understand what they are looking for.
        2. Acknowledge that no matching products were found.
        3. Provide some information about the type of product they are looking for, including popular features or models.
        4. Suggest alternative actions or searches the user can try.
        5. Offer tips on how to refine their search for better results.

        Here is the user's query: "${query}"

        Provide your response below:
    `;

    const response = await getModelResponse(dynamicPrompt);
    return response;
}

async function fetchResponseWithProducts(filteredProducts, query) {
    const productDetailsList = JSON.stringify(filteredProducts);

    const dynamicPrompt = `You are an intelligent assistant. Your task is to generate detailed product suggestions based   on the provided product list and user query.

        Follow these step-by-step instructions:
        
        1. Read the provided product list carefully:
           ${productDetailsList}

        2. Analyze each product's attributes, including title, description, price, and image URL.

        3. Determine the key selling points of each product, such as unique features, affordability, or brand reputation.

        4. Based on the user query, select the most relevant products to recommend.

        5. For each selected product, generate a detailed suggestion that includes:
           - The product title
           - A brief description of the product
           - The price
         
        6. Ensure the response is informative and helps the user make an informed decision.

        Here is the user's query: "${query}"

        Provide your detailed product suggestions below:
    `;

    const response = await getModelResponse(dynamicPrompt);
    return response;
}

function getFilteredProducts(productList) {
    return productList.map(product => {
        const title = product.title;
        const description = product.body_html.replace(/<[^>]*>/g, '');
        const price = product.variants[0].price || product.price;
        const imageUrl = product.imageUrl || product.images[0]?.src;

        return { title, description, price, imageUrl };
    });
}


async function fetchUniqueCategories(client) {
    const db = client.db("products");
    const collection = db.collection("products");

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

async function searchProducts(queryVector, priceFilter) {
    const data = await index.query({
        vector: queryVector,
        filter: priceFilter !== null ? { price: { "$lte": priceFilter } } : undefined,
        topK: 5
    });

    const ids = data ? data.matches.map(item => parseInt(item.id)) : [];
    return ids;
}

async function fetchProductDetails(client, ids) {
    const collection = client.db("products").collection("Products");
    const documents = await collection.find({ id: { $in: ids } }).toArray();
    return documents;
}

async function handleUserQuery(query) {

    const initialResponse = await getModelResponse(getInitialPrompt(query));

    if (initialResponse.toLowerCase().includes('product suggestions needed')) {
        const client = new MongoClient(mongoURI);
        await client.connect();
        const categories = await fetchUniqueCategories(client);

        const promptWithCategories = generatePromptWithCategories(query, categories);
        const modelMessage = await getModelResponse(promptWithCategories);

        const vectorResponse = await embeddingModel.embedContent(modelMessage);
        const queryVector = vectorResponse.embedding.values;

        // Extract price filter from query
        const priceMatch = query.match(/under \$(\d+)/);
        const priceFilter = priceMatch ? parseFloat(priceMatch[1]) : null;

        const ids = await searchProducts(queryVector, priceFilter);

        if (ids.length === 0) {
            const content = await fetchResponseWithNoProducts(query)

            return {
                message: content
            };
        }

        const products = await fetchProductDetails(client, ids);

        const filteredProducts = getFilteredProducts(products);

        const content = await fetchResponseWithProducts(filteredProducts, query)
        await client.close();

        return {
            message: content,
            productList: filteredProducts
        };
    } else {
        const generalPrompt = `
            You are an intelligent assistant. Your task is to provide helpful and friendly responses to user queries.

            Follow these step-by-step instructions to analyze the query and generate a response:
            1. Read the user's query carefully: "${query}".
            2. Identify the main intent of the query. Determine whether the user is asking for information, seeking advice, or making a general inquiry.
            3. Consider the context and any specific details provided by the user to understand the query better.
            4. Formulate a clear and concise response that directly addresses the user's query.
            5. Ensure your response is friendly, polite, and helpful.

            Provide your response below:
        `;

        const generalResponse = await getModelResponse(generalPrompt);

        return {
            message: generalResponse
        };
    }
}

export const POST = async (req) => {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== 'object' || !message.content) {
            throw new Error("Invalid input: message object with content is required.");
        }

        if (message.role !== "user") {
            throw new Error("Invalid input: message role must be 'user'.");
        }

        const query = message.content;
        const response = await handleUserQuery(query);

        const responseObject = {
            role: "assistant",
            content: response.message,
            product_list: response.productList
        };

        return NextResponse.json(responseObject, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};