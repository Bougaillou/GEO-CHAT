import { dataTemperature } from "@/data/geeData";
import ee from "@google/earthengine";

const getTemperatureData = async (polygonFeature: { type: string, coordinates: number[][] }) => {
    try {
        const polygon = ee.Geometry(polygonFeature);
        const collection = ee.ImageCollection(dataTemperature.api)
            .filterDate(dataTemperature.defaultStartDate, dataTemperature.defaultEndDate)
            .select(dataTemperature.parametres);

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

        const data = await results.getInfo();
        return data.features
    } catch (err) {
        const error = err as Error;
        console.error("Server Error:", error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}

export default getTemperatureData