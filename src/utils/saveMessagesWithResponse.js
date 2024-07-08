import { NextResponse } from "next/server";

const saveMessagesWithResponse = async (messages, chatId, userId, url) => {
    try {
        const body = JSON.stringify({
            messages,
            chatId,
            userId
        });
        const data = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }

        const res = await fetch(new URL(url.replace("test2", "save-chat")), data);

        return res.json();
    } catch (error) {
        return NextResponse.json({
            message: "Error while saving chat messages to database"
        }, { status: 500 })
    }
};

export default saveMessagesWithResponse;
