export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RegionData {
  id: string;
  name: string;
  coordinates: RegionCoordinates;
  createdAt: Date;
}

export interface RegionCoordinates {
  lat: number;
  lng: number;
  radius: number;
  polygon?: Array<[number, number]>;
  geometry: {
    type: string
    coordinates: Array<[number, number]>
  };
}

export type AnalysisResult = {
  dataset: string;
  summary: string;
  data: any;
  visualization?: string;
}

export interface AnalysisData {
  id: string;
  dataset: string;
  parameters: any;
  results: any;
  createdAt: Date;
}

export interface GeospatialQuery {
  query: string;
  dataset?: string;
  region?: RegionCoordinates;
  timeRange?: {
    start: string;
    end: string;
  };
}

export interface MessageRequest {
  content: string;
  region?: RegionCoordinates;
}

export interface MessageResponse {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  analysis?: AnalysisData;
}

export interface MapState {
  isVisible: boolean;
  selectedRegion: RegionCoordinates | null;
  selectedLayer: any;
}

export interface ChatState {
  currentChat: Chat | null;
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
}
