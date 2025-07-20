import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req)
        const { chatId } = await req.json()

        if (!userId) {
            return new Response(JSON.stringify({ succes: false, error: "Unauthorized" }))
        }
        const user = await db.user.findUnique({
            where: { userId: userId }
        });

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }))
        }
        await db.chat.delete({
            where: { id: chatId, userId: user.id }
        })

        return new Response(JSON.stringify({ success: true, message: "Chat Delete" }))

    } catch (error) {
        const err = error as Error
        return new Response(JSON.stringify({ success: false, error: err.message }))
    }
}