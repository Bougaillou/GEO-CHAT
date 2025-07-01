import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";


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

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: prompt,
        });
        const geminiReply = response.text;

        const message = {
            role: "assistant",
            content: geminiReply,
            timestamp: Date.now(),
        };

        data.messages.push(message);
        await data.save();

        return new Response(JSON.stringify({ success: true, data: message }), { status: 200 });

    } catch (error) {
        const err = error as Error;
        console.error({ success: false, error: err.message });
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 });
    }
}
