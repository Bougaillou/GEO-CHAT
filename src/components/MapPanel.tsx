import { CONFIRM_SELECTION_TEXT, LOADING_MAP_TEXT, SELECT_REGION_TEXT } from '@/lib/constant'
import { RegionCoordinates } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { Check, RotateCcw, X } from 'lucide-react'

interface MapPanelProps {
    isVisible: boolean
    onClose: () => void
    onConfirmRegion: (region: RegionCoordinates) => void
}

const MapPanel = ({ isVisible, onClose, onConfirmRegion }: MapPanelProps) => {

    // useRef
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)

    // useState
    const [selectedRegion, setSelectedRegion] = useState<RegionCoordinates | null>(null)
    const [selectedLayer, setSelectedLayer] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    // useEffect
    useEffect(() => {
        if (!isVisible || mapInstanceRef.current) return

        const initMap = async () => {
            setIsLoading(true)

            try {
                await new Promise(resolve => setTimeout(resolve, 50))

                const L = await import('leaflet')

                delete (L.Icon.Default.prototype as any)._getIconUrl
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                })

                if (mapRef.current && !mapInstanceRef.current) {
                    const leafletMap = L.map(mapRef.current, {
                        center: [20, 0],
                        zoom: 2,
                        zoomControl: true,
                        attributionControl: true
                    })

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 19
                    }).addTo(leafletMap)

                    leafletMap.on('click', function (e: any) {
                        if (selectedLayer) {
                            leafletMap.removeLayer(selectedLayer)
                        }

                        const radius = 100000 // 100km radius
                        const layer = L.circle(e.latlng, {
                            color: '#10A37F',
                            fillColor: '#10A37F',
                            fillOpacity: 0.2,
                            radius: radius,
                            weight: 2
                        }).addTo(leafletMap)

                        setSelectedLayer(layer)
                        setSelectedRegion({
                            lat: e.latlng.lat,
                            lng: e.latlng.lng,
                            radius: radius
                        })
                    })

                    mapInstanceRef.current = leafletMap
                    setTimeout(() => {
                        leafletMap.invalidateSize()
                    }, 100)
                }
            } catch (error) {
                console.error('Error initializing map:', error)
            } finally {
                setIsLoading(false)
            }
        }
        initMap()
    }, [isVisible])

    useEffect(() => {
        if (!isVisible && mapInstanceRef.current) {
            mapInstanceRef.current.remove()
            mapInstanceRef.current = null
            setSelectedLayer(null)
            setSelectedRegion(null)
        }
    }, [isVisible])

    useEffect(() => {
        if (isVisible && mapInstanceRef.current) {
            setTimeout(() => {
                mapInstanceRef.current.invalidateSize()
            }, 300)
        }
    }, [isVisible])

    // handlers
    const handleConfirm = () => {
        if (selectedRegion) {
            onConfirmRegion(selectedRegion)
            onClose()
        }
    }

    const handleClear = () => {
        if (selectedLayer && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(selectedLayer)
            setSelectedLayer(null)
        }
        setSelectedRegion(null)
    }

    return (
        <>
            <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 ${isVisible ? "translate-x-0" : "translate-x-full"}`}>
                <div className='h-full flex flex-col'>
                    <div className='h-full flex flex-col'>
                        <div className='bg-white border-b border-gray-200 p-4 flex items-center justify-between'>
                            <h3 className='text-lg font-semibold'>{SELECT_REGION_TEXT}</h3>
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={onClose}
                                className='text-gray-500 hover:text-gray-700'
                            >
                                <X className='size-4' />
                            </Button>
                        </div>
                        <div className='flex-1 relative'>
                            <div
                                ref={mapRef}
                                className='w-full h-full min-h-[400px]'
                                style={{ height: '100%' }}
                            />
                            {isLoading && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10A37F] mx-auto mb-2"></div>
                                        <div className="text-sm text-gray-600">{LOADING_MAP_TEXT}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='p-4 border-t border-gray-200 bg-gray-50'>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={handleConfirm}
                                    disabled={!selectedRegion}
                                    className="flex-1 bg-blue-400 hover:bg-blue-500 text-white disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    {CONFIRM_SELECTION_TEXT}
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleClear}
                                    className="px-3"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MapPanel