import mongoose from "mongoose"

declare global {
    var mongoose: MongooseCache | undefined
}

interface MongooseCache {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

const globalAny = global as typeof globalThis & { mongoose?: MongooseCache }

// handle if  globalAny.mongoose is null or undefien
const cached: MongooseCache = globalAny.mongoose ?? {
    conn: null,
    promise: null,
}

globalAny.mongoose = cached

export default async function connectDB() {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URL!)
            .then((mongoose) => mongoose)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error)
        throw error
    }

    return cached.conn

}
