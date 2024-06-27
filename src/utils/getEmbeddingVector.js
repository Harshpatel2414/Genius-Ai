import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

const getEmbeddingVector = async (message) => {
    const vector = await embeddingModel.embedContent(message)
    return vector
}

export default getEmbeddingVector