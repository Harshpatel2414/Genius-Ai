import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getModelResponse = async (prompt) => {
    const result = await model.generateContent(prompt);
    const parts = result.response.candidates[0]?.content?.parts;
    const content = parts ? parts.map(part => part.text).join(' ') : '';
    return content;
}
export default getModelResponse