import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/user";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

interface UserType {
    _id: string
    name: string
    email: string
    image: string
}

export async function POST(req: any) {
    const wh = new Webhook(process.env.SINGING_SECRET!)
    const headerPayload = await headers()

    const svix_id = headerPayload.get("svix-id");
    const svix_signature = headerPayload.get("svix-signature");
    const svix_timestamp = headerPayload.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
        return new Response("No svix headers found", {
            status: 400,
        });
    }
    const svixHeaders = {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        'svix_timestamp': svix_timestamp
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const { data, type } = wh.verify(body, svixHeaders) as WebhookEvent

// const userData
}