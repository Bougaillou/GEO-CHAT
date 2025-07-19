import { NextResponse } from "next/server"
import { checkUser } from "@/lib/checkUser"

export async function POST() {
    try {
        const user = await checkUser()

        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 })
        }

        return NextResponse.json({ user }, { status: 200 })
    } catch (err: any) {
        console.error("API /user error:", err)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
