import { useChat } from "@/actions/ChatContext";
import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { Message } from "@prisma/client";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req)

        if (!userId) {
            return new Response(JSON.stringify({ succes: false, error: "Unauthorized" }))
        }

        const { content, role } = await req.json()

        const { currentChat } = useChat()

        if (!currentChat) {
            return new Response(JSON.stringify({ succes: false, error: "No CurrentChaT" }))

        }

        const newMessage: Message = await db.message.create({
            data: {
                chatId: currentChat.id,
                role,
                content
            }
        })

        return new Response(JSON.stringify({ success: true, data: newMessage }))


    } catch (error) {
        const err = error as Error
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 })
    }

}