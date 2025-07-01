import { Webhook } from "svix"
import connectDB from "@/config/db"
import User from "@/models/user"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server";

interface UserType {
    id: string,
    email_addresses: { email_address: string }[];
    first_name: string
    last_name: string
    image_url: string
}

export async function POST(req: Request) {
    const wh = new Webhook(process.env.SINGING_SECRET!)
    const headerPayload = await headers()

    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    if (!svix_id || !svix_signature || !svix_timestamp) {
        return new Response("No svix headers found", {
            status: 400,
        })
    }
    const svixHeaders = {
        "svix-id": svix_id,
        'svix-timestamp': svix_timestamp,
        "svix-signature": svix_signature,
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const { data, type } = wh.verify(body, svixHeaders) as WebhookEvent



    const { id, email_addresses, first_name, last_name, image_url } = data as UserType;

    if (!email_addresses || email_addresses.length === 0) {
        return new Response("Missing email address in Clerk payload", { status: 400 });
    }

    const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        image: image_url
    };


    await connectDB()

    switch (type) {
        case 'user.created':
            await User.create(userData)
            break
        case 'user.updated':
            await User.findByIdAndUpdate(data.id, userData)
            break
        case 'user.deleted':
            await User.findByIdAndDelete(data.id)
            break
        default:
            break
    }

    return new Response("Event successfully", { status: 200 })

}   