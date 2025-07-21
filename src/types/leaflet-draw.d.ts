// types/leaflet-draw.d.ts

import * as L from 'leaflet';

declare module 'leaflet' {
    namespace Control {
        interface DrawConstructorOptions {
            draw?: {
                polygon?: any;
                rectangle?: any;
                circle?: boolean;
                polyline?: boolean;
                marker?: boolean;
                circlemarker?: boolean;
            };
            edit?: {
                featureGroup?: L.FeatureGroup;
            };
        }

        class Draw extends L.Control {
            constructor(options?: DrawConstructorOptions);
        }
    }

    namespace Draw {
        namespace Event {
            const CREATED: string;
            const EDITED: string;
            const DELETED: string;
            const DRAWSTART: string;
            const DRAWSTOP: string;
            const DRAWVERTEX: string;
            const EDITSTART: string;
            const EDITMOVE: string;
            const EDITRESIZE: string;
            const EDITSTOP: string;
            const DELETESTART: string;
            const DELETESTOP: string;
        }
    }
}

declare module 'leaflet-draw' {
    // This allows the import to work without errors
}

declare module 'leaflet-draw/dist/leaflet.draw.js' {
    // This allows the import to work without errors
}