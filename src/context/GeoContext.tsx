"use client"

import { useAuth, useUser } from '@clerk/nextjs'
import React, { createContext, useContext, useState } from 'react'

interface GeometryInterface {
  type: string
  coordinates: number[][][] | number[][]
}

export interface GeoState {
  geometry: GeometryInterface | null | undefined;
  setGeometry: React.Dispatch<React.SetStateAction<GeometryInterface | null>>;
}

const defaultState = {
  geometry: null,
  setGeometry: () => { },
}

const GeoContext = createContext<GeoState>(defaultState)

export const useGeoContext = () => {
  return useContext(GeoContext)
}

export const GeoContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [geometry, setGeometry] = useState<GeometryInterface | null>(null)



  return (
    < GeoContext.Provider value={{ geometry, setGeometry }} > {children}</GeoContext.Provider>
  )
}
