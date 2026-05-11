import { axiosInstance } from "@/services/axiosInstance";

/**
 * Fetch the chat history for a session from the backend
 */
export async function getChatHistory(sessionId: string) {
  const response = await axiosInstance.get(`/chatbot/history/${sessionId}`);
  return response.data;
}

/**
 * Send a message to the chatbot and return the streaming response
 */
export async function askChatbotStream(message: string, sessionId: string): Promise<Response> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/chatbot/ask-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      message,
      sessionId
    })
  });
  return response;
}

/**
 * Clear/delete the chat history for a session from the backend
 */
export async function deleteChatHistory(sessionId: string) {
  const response = await axiosInstance.delete(`/chatbot/history/${sessionId}`);
  return response.data;
}
