'use server'

import { currentUser } from "@clerk/nextjs/server"
import { db } from "./db"
import { User } from "@prisma/client"

export const checkUser = async (): Promise<User | null> => {
    try {
        const user = await currentUser()
        // console.log("currentUser:", user)

        if (!user) return null

        const existingUser = await db.user.findUnique({
            where: { userId: user.id }
        })
        // console.log("existingUser:", existingUser)

        if (existingUser) return existingUser

        const primaryEmail = user.emailAddresses?.[0]?.emailAddress ?? "unknown@domain.com"

        const newUser = await db.user.create({
            data: {
                userId: user.id,
                emailAddress: primaryEmail,
                firstname: user.firstName ?? "",
                lastname: user.lastName ?? "",
                image: user.imageUrl ?? "",
            }
        })

        // console.log("newUser created:", newUser)
        return newUser
    } catch (err) {
        console.error("checkUser error:", err)
        throw err
    }
}
