import connectDB from "@/config/db";
import Chat from "@/models/chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return new Response(JSON.stringify({ succes: false, error: "Unauthorized" }), { status: 401 });
        }

        const chatData = {
            userId,
            messages: [],
            name: "New Chat"
        }

        await connectDB()
        await Chat.create(chatData)

        return new Response(JSON.stringify({ success: true, message: 'Chat created' }), { status: 200 })

    } catch (error) {
        const err = error as Error
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 })
    }
}