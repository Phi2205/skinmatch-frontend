'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/authContext';
import { Message, RecommendedProduct } from '../types';
import { toast } from 'sonner';

export function useChatbot() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Track state for the message currently being streamed
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingProducts, setStreamingProducts] = useState<RecommendedProduct[]>([]);

  const isStreamingRef = useRef(false);

  // Initialize or fetch Session ID
  useEffect(() => {
    if (isAuthenticated && user) {
      setSessionId(`user-session-${user.id}`);
    } else {
      const cachedGuestSession = localStorage.getItem('skinmatch_guest_session_id');
      if (cachedGuestSession) {
        setSessionId(cachedGuestSession);
      } else {
        const newGuestSession = `guest-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('skinmatch_guest_session_id', newGuestSession);
        setSessionId(newGuestSession);
      }
    }
  }, [user, isAuthenticated]);

  // Load chat history from backend if available on mount/session change
  useEffect(() => {
    if (!sessionId) return;

    // We can also let the chatbot component fetch initial historical messages from redis, 
    // but since the backend currently doesn't have an endpoint for fetching history separately 
    // (it only manages it via redis), we can load the cached chat history from localStorage 
    // for seamless offline-first experience, and let backend manage context internally.
    const cachedHistory = localStorage.getItem(`skinmatch_chat_history_${sessionId}`);
    if (cachedHistory) {
      try {
        setMessages(JSON.parse(cachedHistory));
      } catch (e) {
        setMessages([]);
      }
    } else {
      // Set initial welcome message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Xin chào! Mình là **SkinMatch AI Expert** - Chuyên gia tư vấn da liễu và mỹ phẩm của SkinMatch. Rất vui được hỗ trợ bạn! Hôm nay làn da của bạn đang cần mình tư vấn vấn đề gì thế nhỉ?',
          timestamp: new Date().toISOString(),
          products: []
        }
      ]);
    }
  }, [sessionId]);

  // Persist messages locally as well
  const saveLocalHistory = useCallback((msgs: Message[]) => {
    if (sessionId) {
      localStorage.setItem(`skinmatch_chat_history_${sessionId}`, JSON.stringify(msgs));
    }
  }, [sessionId]);

  const clearChat = useCallback(() => {
    if (isStreamingRef.current) {
      toast.warning('Đang nhận phản hồi, không thể xóa lúc này.');
      return;
    }

    const initialWelcome: Message = {
      id: 'welcome',
      role: 'assistant',
      content: 'Xin chào! Mình là **SkinMatch AI Expert** - Chuyên gia tư vấn da liễu và mỹ phẩm của SkinMatch. Rất vui được hỗ trợ bạn! Hôm nay làn da của bạn đang cần mình tư vấn vấn đề gì thế nhỉ?',
      timestamp: new Date().toISOString(),
      products: []
    };

    setMessages([initialWelcome]);
    setStreamingContent('');
    setStreamingProducts([]);
    
    if (sessionId) {
      localStorage.removeItem(`skinmatch_chat_history_${sessionId}`);
    }
    
    // Generate a fresh guest session ID if not authenticated
    if (!isAuthenticated) {
      const newGuestSession = `guest-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('skinmatch_guest_session_id', newGuestSession);
      setSessionId(newGuestSession);
    }
    toast.success('Đã xóa lịch sử trò chuyện.');
  }, [sessionId, isAuthenticated]);

  const sendMessage = useCallback(async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    // Clear input
    if (!customText) {
      setInput('');
    }

    // Add user message to UI immediately
    const userMsgId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    const updatedMsgs = [...messages, userMessage];
    setMessages(updatedMsgs);
    saveLocalHistory(updatedMsgs);

    // Prepare streaming state
    setIsLoading(true);
    setStreamingContent('');
    setStreamingProducts([]);
    isStreamingRef.current = true;

    try {
      // Fetch stream from backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/chatbot/ask-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          sessionId: sessionId || 'phien-chat-hien-tai'
        })
      });

      if (!response.ok) {
        throw new Error(`Lỗi kết nối máy chủ (${response.status})`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      if (!reader) {
        throw new Error('Không thể mở cổng nhận dữ liệu stream.');
      }

      let accumulatedAnswer = '';
      let accumulatedProducts: RecommendedProduct[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep partial line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith('data: ')) {
            const rawData = trimmedLine.substring(6).trim();
            if (rawData === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(rawData);
              if (parsed.type === 'chunk') {
                accumulatedAnswer += parsed.content;
                setStreamingContent(accumulatedAnswer);
              } else if (parsed.type === 'products') {
                accumulatedProducts = parsed.products || [];
                setStreamingProducts(accumulatedProducts);
              } else if (parsed.type === 'error') {
                toast.error(parsed.message || 'Lỗi xử lý AI');
              }
            } catch (e) {
              // Ignore partial parsing errors
            }
          }
        }
      }

      // Finish streaming successfully
      const assistantMsgId = `assistant-${Date.now()}`;
      const finalAssistantMessage: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: accumulatedAnswer,
        products: accumulatedProducts,
        timestamp: new Date().toISOString()
      };

      const finalMsgs = [...updatedMsgs, finalAssistantMessage];
      setMessages(finalMsgs);
      saveLocalHistory(finalMsgs);

    } catch (error: any) {
      console.error('Lỗi nhận luồng stream:', error);
      toast.error(error.message || 'Lỗi nhận kết nối từ Chatbot, vui lòng thử lại!');
      
      // Put a fallback message
      const assistantMsgId = `assistant-error-${Date.now()}`;
      const errorMsg: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: 'Rất tiếc, mình vừa gặp lỗi kết nối đường truyền với máy chủ. Bạn vui lòng gửi lại câu hỏi nhé!',
        timestamp: new Date().toISOString()
      };
      const errorMsgs = [...updatedMsgs, errorMsg];
      setMessages(errorMsgs);
      saveLocalHistory(errorMsgs);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
      setStreamingProducts([]);
      isStreamingRef.current = false;
    }
  }, [input, isLoading, messages, sessionId, saveLocalHistory]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearChat,
    streamingContent,
    streamingProducts,
    sessionId
  };
}
