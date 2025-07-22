import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
});

export interface GeospatialAnalysisRequest {
  query: string;
  region?: {
    lat: number;
    lng: number;
    radius?: number;
    name?: string;
  };
  geeData?: any;
}

export interface ParsedGeospatialQuery {
  dataset: string;
  region: string;
  timeRange: {
    start: string;
    end: string;
  };
  analysisType: string;
  confidence: number;
}

// Parse natural language query into structured parameters
export async function parseGeospatialQuery(query: string): Promise<ParsedGeospatialQuery> {
  try {
    const systemPrompt = `You are a geospatial data analysis expert.
Your job is to parse the user's natural language query into structured parameters for Google Earth Engine analysis.

Follow these rules strictly:
- **If a time period or date range is mentioned by the user, extract it exactly as stated.**
- **Only default to the most recent complete year (e.g., 2023) if no date or range is mentioned at all.**
- All dates must be in ISO format (YYYY-MM-DD).
- Do not make assumptions about dates. Be literal.

Extract:
- dataset: temperature, rainfall, precipitation, ndvi, vegetation, landcover, etc.
- region: geographic location mentioned (country, city, area name)
- timeRange: start and end dates (from the user query if available)
- analysisType: trend, average, comparison, change, pattern, etc.
- confidence: 0-1 score for parsing accuracy

Respond ONLY with JSON in this exact format:
{
  "dataset": "string",
  "region": "string", 
  "timeRange": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "analysisType": "string",
  "confidence": 0.95
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            dataset: { type: "string" },
            region: { type: "string" },
            timeRange: {
              type: "object",
              properties: {
                start: { type: "string" },
                end: { type: "string" }
              },
              required: ["start", "end"]
            },
            analysisType: { type: "string" },
            confidence: { type: "number" }
          },
          required: ["dataset", "region", "timeRange", "analysisType", "confidence"]
        }
      },
      contents: query
    });

    const result = response.text;
    if (!result) {
      throw new Error("Empty response from Gemini");
    }

    // console.log("////////////// Gemini raw response:", result);

    return JSON.parse(result);
  } catch (error) {
    console.error("Error parsing geospatial query:", error);
    // Fallback basic parsing
    return {
      dataset: "temperature",
      region: "global",
      timeRange: {
        start: "2023-01-01",
        end: "2023-12-31"
      },
      analysisType: "analysis",
      confidence: 0.3
    };
  }
}

// Generate analysis response from GEE data
export async function generateAnalysisResponse(
  request: GeospatialAnalysisRequest
): Promise<string> {
  try {
    const systemPrompt = `You are a friendly geospatial analysis assistant. 
Analyze the provided Google Earth Engine data and user query to generate a comprehensive, easy-to-understand response.

Guidelines:
- Use friendly, conversational tone
- Explain technical concepts clearly
- Provide specific insights and patterns
- Include relevant statistics when available
- Suggest follow-up questions or actions
- Use emojis and formatting for better readability
- Never show raw configuration or code
- Focus on actionable insights

Format the response with:
- Brief summary of findings
- Key statistics in a structured format
- Trends or patterns identified
- Contextual interpretation
- Suggestions for next steps`;

    const prompt = `
User Query: ${request.query}
${request.region ? `Selected Region: ${request.region.name} (${request.region.lat}, ${request.region.lng})` : ''}
${request.geeData ? `Google Earth Engine Data: ${JSON.stringify(request.geeData)}` : 'No GEE data available (using sample analysis)'}

Generate a comprehensive analysis response.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt
      },
      contents: prompt
    });

    return response.text || "I apologize, but I couldn't generate a complete analysis at this time. Please try rephrasing your question or selecting a different region.";
  } catch (error) {
    console.error("Error generating analysis response:", error);
    return "I encountered an error while analyzing your request. Please try again or contact support if the issue persists.";
  }
}

// Generate chat title from first message
export async function generateChatTitle(firstMessage: string): Promise<string> {
  try {
    const systemPrompt = `Generate a short, descriptive title (2-5 words) for a geospatial analysis chat based on the first user message. 
Focus on the key topic, location, or analysis type.
Examples:
- "Morocco Temperature 2023"
- "Sahel Rainfall Analysis" 
- "Amazon NDVI Trends"
- "Global Climate Patterns"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt
      },
      contents: firstMessage
    });

    const title = response.text?.trim() || "Geospatial Analysis";
    return title.length > 50 ? title.substring(0, 47) + "..." : title;
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "Geospatial Analysis";
  }
}

// Check if query is geospatial-related
export async function isGeospatialQuery(query: string): Promise<boolean> {
  try {
    const systemPrompt = `Determine if the user query is related to geospatial analysis, environmental data, climate, weather, geography, or Earth observation.
Respond with only "true" or "false".`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt
      },
      contents: query
    });

    return response.text?.trim().toLowerCase() === "true";
  } catch (error) {
    console.error("Error checking geospatial query:", error);
    return true; // Default to true for geospatial assistant
  }
}
