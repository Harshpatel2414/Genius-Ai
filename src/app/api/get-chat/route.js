import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        const { chatId } = await req.json();

        if (!chatId) {
            return NextResponse.json({ message: "No chatId provided" }, { status: 400 });
        }

        const client = new MongoClient(process.env.MONGO_URI);

        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection("Chats");

        const chat = await collection.findOne({ _id: new ObjectId(chatId) });

        await client.close();

        if (!chat) {
            return NextResponse.json({ message: "Chat not found" }, { status: 404 });
        }

        const chatHistory = chat.chat_history || [];

        return NextResponse.json(chatHistory, { status: 200 });
    } catch (error) {
        console.error("Error while fetching chat history from database", error);
        return NextResponse.json({
            message: "Error while fetching chat history from database"
        }, { status: 500 });
    }
};
