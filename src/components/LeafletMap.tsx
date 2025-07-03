'use client'

import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'


function toGeoJSONSafe(layer: L.Layer) {
    if ('toGeoJSON' in layer && typeof (layer as any).toGeoJSON === 'function') {
        return (layer as any).toGeoJSON()
    }
    return null
}

interface GeoJSONFeature {
    type: string
    geometry: {
        type: string
        coordinates: number[][][] | number[][]
    }
    properties: Record<string, any>
}

interface DrawControlProps {
    onAreaSelected: (geojson: GeoJSONFeature | null) => void
    onFinalize: () => void
}

function DrawControl({ onAreaSelected, onFinalize }: DrawControlProps) {
    const map = useMap()
    const initializedRef = useRef(false)
    const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup())

    useEffect(() => {
        if (initializedRef.current) return
        initializedRef.current = true

        const drawnItems = drawnItemsRef.current
        map.addLayer(drawnItems)

        const drawControl = new L.Control.Draw({
            draw: {
                polygon: true,
                rectangle: true,
                circle: false,
                marker: false,
                polyline: false,
                circlemarker: false
            },
            edit: {
                featureGroup: drawnItems
            }
        })

        map.addControl(drawControl)

        map.on('draw:created', function (e: any) {
            const layer = e.layer
            drawnItems.addLayer(layer)
            if (layer.toGeoJSON) {
                const geojson = layer.toGeoJSON()
                console.log('GeoJSON 12 :', geojson)
                onAreaSelected(geojson)
            }
        })

        map.on('draw:deleted', function () {
            if (drawnItems.getLayers().length === 0) {
                onAreaSelected(null)
            }
        })

        map.on('draw:edited', function (e: any) {
            const layers = e.layers
            if (layers && layers.eachLayer) {
                layers.eachLayer(function (layer: any) {
                    if (layer.toGeoJSON) {
                        const geojson = layer.toGeoJSON()
                        console.log('Edited GeoJSON:', geojson)
                        onAreaSelected(geojson)
                    }
                })
            }
        })


    }, [map, onAreaSelected])

    return null
}

export default function LeafletMap(): React.JSX.Element {
    const [selectedArea, setSelectedArea] = useState<GeoJSONFeature | null>(null)
    const [showFinalizeButton, setShowFinalizeButton] = useState<boolean>(false)

    const handleAreaSelected = (geojson: GeoJSONFeature | null): void => {
        console.log("//////::", geojson)
        setSelectedArea(geojson)
        setShowFinalizeButton(!!geojson)
    }

    const handleFinalize = () => {
        if (selectedArea) {
            console.log('Finalizing area:', selectedArea)
            // Add your finalization logic here
            // Optionally hide the button after finalization
            // setShowFinalizeButton(false)
        }
    }

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={[31.7917, -7.0926]}
                zoom={6}
                className="h-full w-full"
                whenReady={() => console.log('Carte prête')}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DrawControl onAreaSelected={handleAreaSelected} onFinalize={handleFinalize} />
            </MapContainer>

            {showFinalizeButton && (
                <button
                    onClick={handleFinalize}
                    className="absolute bottom-20 cursor-pointer left-1/2 z-[1000] -translate-x-1/2 transform rounded-lg border-none bg-gray-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Finalize
                </button>
            )}
        </div>
    )
}