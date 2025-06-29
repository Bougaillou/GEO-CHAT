import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const auth = getAuth(req);
        const userId = auth.userId;

        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }

        await connectDB();

        const { chatId, prompt } = await req.json();

        const data = await Chat.findOne({ userId, _id: chatId });

        if (!data) {
            return new Response(JSON.stringify({ success: false, error: "Chat not found" }), { status: 404 });
        }

        const userPrompt = {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
        };
        data.messages.push(userPrompt);

        console.log('/////////////////////')
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            store: true,
        });

        console.log('/////////////////////')
        const message = {
            ...completion.choices[0].message,
            timestamp: Date.now(),
        };

        data.messages.push(message);
        await data.save();

        return new Response(JSON.stringify({ success: true, data: message }), { status: 200 });
    } catch (error) {
        const err = error as Error;
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 });
    }
}
