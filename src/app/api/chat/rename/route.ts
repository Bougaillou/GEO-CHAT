// 'use server'
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

        const { chatId, name } = await req.json()

        await connectDB()
        await Chat.findOneAndUpdate({ _id: chatId, userId }, { name })

        return new Response(JSON.stringify({ success: true, message: "Chat Rename" }), { status: 200 })

    } catch (error) {
        const err = error as Error
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 })
    }
}