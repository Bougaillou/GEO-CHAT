export const maxDuration = 60
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type Data = {
    response?: string;
    error?: string;
};

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Only POST method allowed" });
//   }

//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: message }],
//     });

//     res.status(200).json({ response: completion.choices[0].message.content! });
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// }
export async function Post(req: NextApiRequest) {
    try {
        const { userId } = getAuth(req)

        const { chatId, prompt } = await req.body

        if (!userId) {
            return new Response(JSON.stringify({ succes: false, error: "Unauthorized" }), { status: 401 });
        }

        await connectDB()
        const data = await Chat.findOne({ userId, _id: chatId })

        const userPrompt = {
            role: 'user',
            content: prompt,
            timestamp: Date.now()
        }

        data.messages.push(userPrompt)

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            store: true
        });

        const message = {
            ...completion.choices[0].message,
            timestamp: Date.now(),
        };

        data.messages.push(message)
        data.save()


        return new Response(JSON.stringify({ success: true, data: message }), { status: 200 })

    } catch (error) {
        const err = error as Error
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 })
    }
}