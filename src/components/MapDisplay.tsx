'use client'
import React from 'react'
import { X } from 'lucide-react'
// import LeafletMap from './LeafletMap'
import dynamic from 'next/dynamic'

const LeafletMap = dynamic(() => import('./LeafletMap'), {
    ssr: false,
    loading: () => <p>Chargement de la carte...</p>,
})

const MapDisplay = ({ displayMap, setDisplayMap }: { displayMap: boolean, setDisplayMap: (displayMap: boolean) => void }) => {
    return (
        <div className={`fixed top-0 right-0 h-full w-full sm:w-[50%] bg-[#292a2d] z-50 shadow-2xl border-l border-gray-700 transform transition-transform duration-300 ease-in-out ${displayMap ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center p-4 bg-[#404045]border-b border-gray-700">
                <h2 className="text-white text-sm font-semibold">View Map</h2>
                <X className="text-white cursor-pointer hover:text-red-400 transition" onClick={() => setDisplayMap(false)} />
            </div>
            <div className="w-full h-full flex justify-center items-center text-white">
                <LeafletMap />
            </div>
        </div>
    )
}

export default MapDisplay
