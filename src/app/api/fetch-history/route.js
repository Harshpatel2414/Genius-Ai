import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ message: "No userId provided" }, { status: 400 });
        }

        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection("Chats");

        const chatHistory = await collection.find(
            { userId: userId },
            {
                projection: { title: 1, _id: 1, created_at: 1 },
                sort: { created_at: -1 } 
            }
        ).toArray();

        await client.close();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);

        const categorizedChats = chatHistory.reduce((acc, chat) => {
            const chatDate = new Date(chat.created_at);
            chatDate.setHours(0, 0, 0, 0);

            if (chatDate.getTime() === today.getTime()) {
                acc.today.push(chat);
            } else if (chatDate.getTime() === yesterday.getTime()) {
                acc.yesterday.push(chat);
            } else {
                acc.twoDaysAgo.push(chat); // Older chats fall into "twoDaysAgo"
            }
            return acc;
        }, { today: [], yesterday: [], twoDaysAgo: [] });

        return NextResponse.json(categorizedChats, { status: 200 });

    } catch (error) {
        console.error("Error while fetching chat history from database", error);
        return NextResponse.json({
            message: "Error while fetching chat history from database"
        }, { status: 500 });
    }
};


// import { MongoClient, ObjectId } from "mongodb";
// import { NextResponse } from "next/server";

// export const POST = async (req) => {
//     try {
//         const { userId } = await req.json();

//         if (!userId) {
//             return NextResponse.json({ message: "No userId provided" }, { status: 400 });
//         }

//         const client = new MongoClient(process.env.MONGO_URI);
//         await client.connect();
//         const db = client.db(process.env.DATABASE);
//         const collection = db.collection("Chats");

//         const chatHistory = await collection.find(
//             { userId: userId },
//             {
//                 projection: { title: 1, _id: 1, created_at: 1 }
//             }
//         ).toArray();

//         await client.close();

//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const yesterday = new Date(today);
//         yesterday.setDate(today.getDate() - 1);

//         const twoDaysAgo = new Date(today);
//         twoDaysAgo.setDate(today.getDate() - 2);

//         const categorizedChats = chatHistory.reduce((acc, chat) => {
//             const chatDate = new Date(chat.created_at);
//             chatDate.setHours(0, 0, 0, 0);

//             if (chatDate.getTime() === today.getTime()) {
//                 acc[0].today.push(chat); // Index 0 for today
//             } else if (chatDate.getTime() === yesterday.getTime()) {
//                 acc[1].yesterday.push(chat); // Index 1 for yesterday
//             } else {
//                 acc[2].twoDaysAgo.push(chat); // Index 2 for two days ago or older
//             }
//             return acc;
//         }, [
//             { today: [] },
//             { yesterday: [] },
//             { twoDaysAgo: [] }
//         ]); // Initialize with three objects

//         return NextResponse.json(categorizedChats, { status: 200 });

//     } catch (error) {
//         console.error("Error while fetching chat history from database", error);
//         return NextResponse.json({
//             message: "Error while fetching chat history from database"
//         }, { status: 500 });
//     }
// };
