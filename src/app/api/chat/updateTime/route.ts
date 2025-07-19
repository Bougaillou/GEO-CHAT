import { useChat } from "@/actions/ChatContext";
import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return new Response(JSON.stringify({ succes: false, error: "Unauthorized" }), { status: 401 });
        }

        const { currentChat } = useChat()
        if (!currentChat) {
            return new Response(JSON.stringify({ succes: false, error: "No CurrentChaT" }))

        }

        await db.chat.update({
            where: { id: currentChat.id },
            data: {
                updatedAt: new Date()
            }
        })


        return new Response(JSON.stringify({ success: true, message: "Chat Update Time" }), { status: 200 })

    } catch (error) {
        const err = error as Error
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 })
    }
}