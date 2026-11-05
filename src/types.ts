export interface LegalQueryResponse {
  success: boolean;
  query: string;
  answer: string;
  sources: Array<{ title: string; uri: string }>;
  lawStatus: 'AMALDAGI_QONUNCHILIK' | 'ESKI_HUJJAT_ANIQLANDI_VA_YANGILANDI';
  timestamp: string;
  error?: string;
  details?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sources?: Array<{ title: string; uri: string }>;
  lawStatus?: 'AMALDAGI_QONUNCHILIK' | 'ESKI_HUJJAT_ANIQLANDI_VA_YANGILANDI';
  suggestedButtons?: Array<{ text: string; url?: string; action?: string; callback_data?: string }>;
  rating?: 'up' | 'down';
}

export interface LegalTopic {
  id: string;
  title: string;
  iconName: string;
  codeName: string;
  lexUrl: string;
  sampleQuestions: string[];
}
