import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        const { chatId, id, liked, unliked } = await req.json();

        if (!chatId || !id) {
            return NextResponse.json({ message: "Invalid request parameters" }, { status: 400 });
        }

        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection("Chats");

        const result = await collection.updateOne(
            { 
                _id: new ObjectId(chatId),
                "chat_history._id": id
            },
            { 
                $set: { 
                    "chat_history.$.liked": liked,
                    "chat_history.$.unliked": unliked
                }
            }
        );

        await client.close();
        
        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "Message or chat not found" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Message like status updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error while updating message like status:", error);
        return NextResponse.json({
            message: "Error while updating message like status"
        }, { status: 500 });
    }
};
