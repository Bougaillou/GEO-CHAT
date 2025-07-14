import { geeAuthenticate } from "@/config/gee";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import getTemperatureData from "./geeTemperature";

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }

        await geeAuthenticate();
        const body = await req.json();
        const polygonFeature = body.polygon;
        if (!polygonFeature || !polygonFeature.coordinates) {
            return new Response(JSON.stringify({ success: false, error: "Invalid polygon" }), { status: 400 });
        }
        const data = await getTemperatureData(polygonFeature)
        return new Response(JSON.stringify({ success: true, data }), { status: 200 });



    } catch (err) {
        const error = err as Error;
        console.error("Server Error:", error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
};

