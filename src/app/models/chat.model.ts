export interface ChatMessage {
  role: string;
  content: string;
}

export interface QuestionRequest {
  question: string;
  history: ChatMessage[];
}

export interface UiMessage {
  role: 'user' | 'ai';
  text: string;
}
