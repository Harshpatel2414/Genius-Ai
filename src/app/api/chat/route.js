export const maxDuration = 30;
import { NextResponse } from "next/server";
import fetchInitialPrompt from "@/helpers/fetchInitialPrompt";
import fetchPromptWithCategories from "@/helpers/fetchPromptWithCategories";
import getModelResponse from "@/utils/getModelResponse";
import fetchPromptWithNoProducts from "@/helpers/fetchPromptWithNoProducts";
import getFilteredProducts from "@/utils/getFilteredProducts";
import fetchPromptWithProducts from "@/helpers/fetchPromptWithProducts";
import fetchGeneralPrompt from "@/helpers/fetchGeneralPrompt";
import fetchUniqueCategories from "@/utils/fetchUniqueCategories";
import getEmbeddingVector from "@/utils/getEmbeddingVector";
import saveMessagesWithResponse from "@/utils/saveMessagesWithResponse";
import { ObjectId } from "mongodb";
import fetchProductWithVector from "@/utils/fetchProductWithVector";

export const POST = async (req) => {
    try {
        const { messages, chatId, userId, store } = await req.json();

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

            const categories = await fetchUniqueCategories(store);
            const promptWithCategories = fetchPromptWithCategories(query, categories);
            const modelMessage = await getModelResponse(promptWithCategories);
            const vectorResponse = await getEmbeddingVector(modelMessage);
            const queryVector = vectorResponse.embedding.values;

            const priceMatch = query.match(/under \$(\d+)/);
            const priceFilter = priceMatch ? parseFloat(priceMatch[1]) : Infinity;
            
            const products = await fetchProductWithVector(queryVector,priceFilter,store)
 
            if (products.length === 0) {
                const content = await getModelResponse(fetchPromptWithNoProducts(query, assistantMessage));
               
                const assistantResponse = {
                    role: "assistant",
                    content: content,
                    liked: false,
                    unlike: false,
                    _id: new ObjectId().toString()
                }
                const updatedMessages = [...messages, assistantResponse];

                const newChatId = await saveMessagesWithResponse(updatedMessages, chatId, userId, req.url);

                return NextResponse.json({
                    response: assistantResponse,
                    chatId: newChatId
                }, { status: 200 });
            } else {
                const filteredProducts = getFilteredProducts(products);
                const content = await getModelResponse(fetchPromptWithProducts(filteredProducts, query, assistantMessage));                

                const assistantResponse = {
                    role: "assistant",
                    content: content,
                    product_list: filteredProducts,
                    liked: false,
                    unlike: false,
                    _id: new ObjectId().toString()
                }

                const updatedMessages = [...messages, assistantResponse];

                const newChatId = await saveMessagesWithResponse(updatedMessages, chatId, userId, req.url);

                return NextResponse.json({
                    response: assistantResponse,
                    chatId: newChatId
                }, { status: 200 });
            }
        } else {
            const generalResponse = await getModelResponse(fetchGeneralPrompt(query, assistantMessage));
            const assistantResponse = {
                role: "assistant",
                content: generalResponse,
                liked: false,
                unlike: false,
                _id: new ObjectId().toString()
            }
            const updatedMessages = [...messages, assistantResponse];
            const newChatId = await saveMessagesWithResponse(updatedMessages, chatId, userId, req.url);

            return NextResponse.json({
                response: assistantResponse,
                chatId: newChatId
            }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};