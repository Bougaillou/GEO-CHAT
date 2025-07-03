// Permet à TypeScript de reconnaître L.Control.Draw
import 'leaflet';
import 'leaflet-draw';

declare module 'leaflet' {
    namespace Control {
        class Draw extends L.Control {
            constructor(options?: any);
        }
    }

    namespace Draw {
        namespace Event {
            const CREATED: string;
            const EDITED: string;
            const DELETED: string;
        }
    }
}
