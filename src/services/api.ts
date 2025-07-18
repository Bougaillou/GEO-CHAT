import { RegionCoordinates } from "@/types";

export const mockApi = {
    generateMockResponse(query: string, region?: RegionCoordinates): string {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('temperature')) {
            return `I've analyzed the temperature data for your query. Based on the selected region${region ? ` around (${region.lat.toFixed(2)}, ${region.lng.toFixed(2)})` : ''}, here are the key findings:

**📊 Temperature Analysis:**
• Average temperature: 24.2°C
• Seasonal variation: 18°C (winter) to 32°C (summer)
• Trend: +1.2°C increase over the past decade
• Heat index: Moderate to high during summer months

Would you like me to show this data on the map or analyze specific time periods?`;
        } else if (lowerQuery.includes('rainfall') || lowerQuery.includes('precipitation')) {
            return `I've processed the rainfall data for your specified region. Here's the precipitation analysis:

**🌧️ Rainfall Patterns:**
• Annual precipitation: 450mm
• Wet season: November to March (75% of annual rainfall)
• Dry season: April to October
• Trend: -12% decrease over the past 5 years
• Extreme events: 3 significant droughts recorded

The data shows concerning trends in precipitation patterns. Would you like me to overlay this on the map?`;
        } else if (lowerQuery.includes('ndvi') || lowerQuery.includes('vegetation')) {
            return `I've analyzed the vegetation index (NDVI) data for your selected area. Here's the vegetation health assessment:

**🌿 Vegetation Analysis:**
• Current NDVI: 0.45 (Moderate vegetation)
• Seasonal peak: 0.62 (April-May)
• Vegetation trend: Declining by 5% annually
• Health status: Moderate stress indicators detected
• Recovery potential: Good with improved rainfall

The vegetation shows signs of climate stress. Would you like me to generate a detailed vegetation map?`;
        } else {
            return `I've processed your geospatial query. Here's the analysis:

**📍 Regional Analysis:**
• Dataset: Multi-source satellite imagery
• Time period: Latest available data
• Processing method: Advanced geospatial algorithms
• Confidence level: 92%

The analysis reveals interesting patterns in your selected region. Would you like me to dive deeper into any specific aspect or show the results on the interactive map?`;
        }
    },

    generateMockTitle(query: string): string {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('temperature')) return 'Temperature Analysis';
        if (lowerQuery.includes('rainfall') || lowerQuery.includes('precipitation')) return 'Rainfall Patterns';
        if (lowerQuery.includes('ndvi') || lowerQuery.includes('vegetation')) return 'Vegetation Analysis';
        if (lowerQuery.includes('morocco')) return 'Morocco Analysis';
        if (lowerQuery.includes('sahel')) return 'Sahel Region Study';
        if (lowerQuery.includes('amazon')) return 'Amazon Analysis';
        return 'Geospatial Analysis';
    },
}