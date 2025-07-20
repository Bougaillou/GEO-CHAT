import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req)

        if (!userId) {
            return new Response(JSON.stringify({ succes: false, error: "Unauthorized" }))
        }


        const { chatId } = await req.json()

        const messages = await db.message.findMany({
            where: { chatId: chatId },
            orderBy: { createdAt: 'asc' }
        })
        return new Response(JSON.stringify({ success: true, data: messages }))
    } catch (error) {
        const err = error as Error
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 })
    }
}