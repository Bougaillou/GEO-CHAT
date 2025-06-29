import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

        // Store user message
        const userPrompt = {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
        };
        data.messages.push(userPrompt);

        // Generate response using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const geminiReply = response.text();

        // Store Gemini message
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
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 });
    }
}
