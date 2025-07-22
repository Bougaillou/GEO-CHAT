// app/api/gee/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ee from '@google/earthengine';
import { DATASET_CONFIGS } from '@/lib/constant';

const authenticate = async () => {
  const key = JSON.parse(process.env.NEXT_PUBLIC_GCP_SERVICE_ACCOUNT_KEY!);
  await new Promise<void>((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(
      key,
      () => ee.initialize(null, null, () => resolve(), reject),
      reject
    );
  });
};

export async function POST(req: NextRequest) {
  try {
    const { analyseRequest } = await req.json();

    await authenticate();

    // Your dataset configs
    const config = DATASET_CONFIGS[analyseRequest.dataset.toLowerCase()];
    if (!config) {
      throw new Error(`Unsupported dataset: ${analyseRequest.dataset}`);
    }

    const polygon = ee.Geometry(analyseRequest.geometry);

    const collection = ee.ImageCollection(config.imageCollection)
      .filterDate(analyseRequest.timeRange.start, analyseRequest.timeRange.end)
      .select(config.bands);

    const results = ee.FeatureCollection(collection.map((image: any) => {
      const dateStr = ee.Date(image.get('system:time_start')).format('YYYY-MM');
      const reduced = image.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: polygon,
        scale: config.scale,
        maxPixels: 1e7
      });
      return ee.Feature(null, reduced).set('date', dateStr);
    }));

    const data = await results.getInfo();
    return NextResponse.json({ succes: true, features: data.features });

  } catch (err: any) {
    console.error('GEE Error:', err);
    return NextResponse.json({ succes: false, error: err.message }, { status: 500 });
  }
}
