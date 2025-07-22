export const PROJECT_TITLE: string = 'GEO-IA'

export const MOBILE_BREAKPOINT: number = 768

export const RECENT_CHATS: string = 'Recent Chats'

export const DELETE_CHAT_CONFIRMATION_MESSAGE: string = 'Are you sure you want to delete this chat ?'

export const ADD_NEW_CHAT_TEXT: string = 'Add New Chat'

type Suggestion = {
    icon: string
    title: string
    description: string
}
export const SUGGESTIONS: Suggestion[] = [
    {
        icon: "🌡️",
        title: "Temperature Analysis",
        description: "Analyze temperature patterns across different regions and time periods"
    },
    {
        icon: "🌧️",
        title: "Rainfall Patterns",
        description: "Examine precipitation data and seasonal variations"
    },
    {
        icon: "🌿",
        title: "Vegetation Index",
        description: "Monitor NDVI and vegetation health indicators"
    },
    {
        icon: "🗺️",
        title: "Custom Regions",
        description: "Select specific areas on the map for targeted analysis"
    }
]

export const WELCOME_MESSAGE: string = 'Welcome to GeoTracker'

export const ASKING_MESSAGE: string = 'Ask me anything about geospatial data and environmental analysis'

export const ANALYSING_LOADING_TEXT: string = 'Analyzing...'

export const TEXTAREA_PLACEHOLDER: string = 'Ask about geospatial data, climate patterns, or environmental analysis...'

export const SELECT_REGION_TEXT: string = 'Select Region'

export const LOADING_MAP_TEXT: string = 'Loading map...'

export const CONFIRM_SELECTION_TEXT: string = 'Confirm Selection'

export interface GEEDatasetConfig {
    dataset: string;
    imageCollection: string;
    bands: string[];
    scale: number;
}

export const DATASET_CONFIGS: Record<string, GEEDatasetConfig> = {
    temperature: {
        dataset: "ECMWF/ERA5_LAND/MONTHLY_AGGR",
        imageCollection: "ECMWF/ERA5_LAND/MONTHLY_AGGR",
        bands: ["temperature_2m"],
        scale: 7500,
    },
}