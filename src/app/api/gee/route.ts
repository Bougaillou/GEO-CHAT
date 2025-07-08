import ee from "@google/earthengine";
import { geeAuthenticate } from "@/config/gee";
import { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }

        await geeAuthenticate();
        const body = await req.json();
        const polygonFeature = body.polygon;
        console.log('////////// 5', polygonFeature)
        if (!polygonFeature || !polygonFeature.coordinates) {
            return new Response(JSON.stringify({ success: false, error: "Invalid polygon" }), { status: 400 });
        }
        console.log('////////// 6', polygonFeature)

        const polygon = ee.Geometry(polygonFeature);
        const collection = ee.ImageCollection("ECMWF/ERA5_LAND/MONTHLY_AGGR")
            .filterDate("2014-06-01", "2015-01-01")
            .select([
                "soil_temperature_level_1",
                "soil_temperature_level_2",
                "soil_temperature_level_3",
                "soil_temperature_level_4"
            ]);

        const results = ee.FeatureCollection(collection.map((image: any) => {
            const dateStr = ee.Date(image.get('system:time_start')).format('YYYY-MM');
            const reduced = image.reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: polygon,
                scale: 1000,
                maxPixels: 1e13
            });
            return ee.Feature(null, reduced).set('date', dateStr);
        }));

        const list = await results.getInfo();
        return new Response(JSON.stringify({ success: true, list }), { status: 200 });



    } catch (err) {
        const error = err as Error;
        console.error("Server Error:", error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
};

