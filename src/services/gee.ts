"use server";

import ee from "@google/earthengine";

export async function geeAuthenticate(): Promise<void> {
    const key = process.env.NEXT_PUBLIC_GCP_SERVICE_ACCOUNT_KEY!;

    return new Promise((resolve, reject) => {

        ee.data.authenticateViaPrivateKey(
            JSON.parse(key),
            () =>
                ee.initialize(
                    null,
                    null,
                    () => resolve(console.log('Earth Engine ready')),
                    (error: any) => reject(new Error(error))
                ),
            (error: any) => reject(new Error(error))
        );
    });
}

