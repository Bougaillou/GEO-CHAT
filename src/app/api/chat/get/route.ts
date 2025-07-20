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

        const user = await db.user.findUnique({
            where: { userId: userId }
        });

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }))
        }

        const chats = await db.chat.findMany({
            where: { userId: user.id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { updatedAt: 'desc' }
        })
        return new Response(JSON.stringify({ success: true, data: chats }))
    } catch (error) {
        const err = error as Error
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 })
    }
}