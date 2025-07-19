'use server'

import { currentUser } from "@clerk/nextjs/server"
import { db } from "./db"

export const checkUser = async () => {
    const user = await currentUser()

    if (!user) return null

    // check if user is in db
    const loggedInUser = await db.user.findUnique({
        where: {
            userId: user.id
        }
    })

    // if user not in db
    if (loggedInUser) {
        return loggedInUser
    }

    // if user not in db
    const newUser = await db.user.create({
        data: {
            userId: user.id,
            emailAddress: user.emailAddresses[0].emailAddress,
            firstname: user.firstName ?? "",
            lastname: user.lastName ?? "",
            image: user.imageUrl ?? "",
        } as any
    })

    return newUser
} 