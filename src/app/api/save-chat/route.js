import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        const { messages, chatId, userId } = await req.json();

        if (!messages || messages.length === 0) {
            return NextResponse.json({ message: "No messages provided" }, { status: 400 });
        }

        const client = new MongoClient(process.env.MONGO_URI);

        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection("Chats");

        let existingChat = null;
        if (chatId) {
            existingChat = await collection.findOne({ _id: new ObjectId(chatId) });
        }

        if (!existingChat) {
            const title = messages[0].content;
            const newChat = {
                title: title,
                userId: userId,
                chat_history: messages,
                created_at: new Date(),
                updated_at: new Date()
            };

            const result = await collection.insertOne(newChat);
            const newChatId = result.insertedId.toString();
            await client.close();
            return NextResponse.json(newChatId, { status: 201 });
        } else {
            await collection.updateOne(
                { _id: new ObjectId(chatId) },
                {
                    $set: {
                        chat_history: messages,
                        updated_at: new Date()
                    }
                }
            );

            await client.close();
            return NextResponse.json(chatId, { status: 200 });
        }
    } catch (error) {
        console.error("Error while saving chat messages to database", error);
        return NextResponse.json({
            message: "Error while saving chat messages to database"
        }, { status: 500 });
    }
};
