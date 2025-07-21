"user client"
import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'

import { Button } from './ui/Button'
import { Check, RotateCcw, X } from 'lucide-react'
import {
    CONFIRM_SELECTION_TEXT,
    LOADING_MAP_TEXT,
    SELECT_REGION_TEXT
} from '@/lib/constant'
import { RegionCoordinates } from '@/types'

interface MapPanelProps {
    isVisible: boolean
    onClose: () => void
    onConfirmRegion: (region: RegionCoordinates) => void
}

interface DrawControlProps {
    onAreaSelected: (region: RegionCoordinates | null) => void
}

function DrawControl({ onAreaSelected }: DrawControlProps) {
    const map = useMap()
    const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup())
    const initializedRef = useRef(false)

    useEffect(() => {
        if (initializedRef.current) return
        initializedRef.current = true

        const drawnItems = drawnItemsRef.current
        map.addLayer(drawnItems)

        const drawControl = new L.Control.Draw({
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true,
                    shapeOptions: {
                        color: '#10A37F',
                        weight: 2
                    }
                },
                rectangle: {
                    shapeOptions: {
                        color: '#10A37F',
                        weight: 2
                    }
                },
                circle: false,
                polyline: false,
                marker: false,
                circlemarker: false
            },
            edit: {
                featureGroup: drawnItems
            }
        })

        map.addControl(drawControl)

        map.on('draw:created', (e: any) => {
            const layer = e.layer
            drawnItems.clearLayers()
            drawnItems.addLayer(layer)

            const geojson = layer.toGeoJSON()
            const coords =
                geojson.geometry.type === 'Polygon'
                    ? geojson.geometry.coordinates[0][0]
                    : [0, 0]

            onAreaSelected({
                lat: coords[1],
                lng: coords[0],
                radius: 10000,
                geometry: geojson.geometry
            })
        })

        map.on('draw:deleted', () => {
            onAreaSelected(null)
        })
    }, [map, onAreaSelected])

    return null
}

const MapPanel = ({ isVisible, onClose, onConfirmRegion }: MapPanelProps) => {
    const [selectedRegion, setSelectedRegion] = useState<RegionCoordinates | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div
            className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 ${isVisible ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="h-full flex flex-col">
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{SELECT_REGION_TEXT}</h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="size-4" />
                    </Button>
                </div>

                <div className="flex-1 relative">
                    <div className="w-full h-full min-h-[400px]">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10A37F] mx-auto mb-2"></div>
                                    <div className="text-sm text-gray-600">{LOADING_MAP_TEXT}</div>
                                </div>
                            </div>
                        )}

                        {isVisible && (
                            <MapContainer
                                center={[20, 0]}
                                zoom={2}
                                className="h-full w-full"
                                whenReady={() => setIsLoading(false)}
                            >
                                <TileLayer
                                    attribution="© OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <DrawControl onAreaSelected={setSelectedRegion} />
                            </MapContainer>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => {
                                if (selectedRegion) {
                                    onConfirmRegion(selectedRegion)
                                    onClose()
                                }
                            }}
                            disabled={!selectedRegion}
                            className="flex-1 bg-blue-400 hover:bg-blue-500 text-white disabled:opacity-50"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {CONFIRM_SELECTION_TEXT}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setSelectedRegion(null)}
                            className="px-3"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MapPanel
