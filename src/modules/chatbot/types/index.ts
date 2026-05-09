export interface RecommendedProduct {
  id: number | string;
  name: string;
  slug: string;
  image_url?: string;
  summary?: string;
  price?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: RecommendedProduct[];
  timestamp?: string;
}

export interface AskChatbotRequest {
  message: string;
  sessionId?: string;
}
