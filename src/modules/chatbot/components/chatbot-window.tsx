'use client';

import { useEffect, useRef } from 'react';
import { Send, Sparkles, Trash2, User as UserIcon, Bot, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useChatbot } from '../hooks/useChatbot';
import { ProductRecommendationCard } from './product-recommendation-card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { useAuth } from '@/contexts/authContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatbotWindowProps {
  isFullPage?: boolean;
  onClose?: () => void;
}

// Starter templates to help guide the user
const STARTER_QUESTIONS = [
  {
    text: 'Tư vấn chu trình dưỡng ẩm phục hồi cho da dầu mụn nhạy cảm',
    short: 'Dưỡng ẩm da dầu mụn'
  },
  {
    text: 'Thành phần Niacinamide kết hợp với BHA thế nào cho hiệu quả?',
    short: 'Niacinamide + BHA'
  },
  {
    text: 'Gợi ý kem chống nắng kiềm dầu, không nâng tông dưới 500k',
    short: 'Kem chống nắng <500k'
  },
  {
    text: 'Làm sao để xác định đúng loại da của mình?',
    short: 'Xác định loại da'
  }
];

// Simple premium Markdown text formatter (line-by-line parser)
function MarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;

  // Split content by individual lines
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-[14px] leading-relaxed text-gray-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />; // Compact paragraph spacing
        }

        // 1. Check if line is a header (### Header)
        if (trimmed.startsWith('#')) {
          const depth = (trimmed.match(/^#+/) || ['#'])[0].length;
          const headerText = trimmed.replace(/^#+\s+/, '');
          const sizeClass = depth === 1 ? 'text-lg font-bold mt-3 mb-1.5' : depth === 2 ? 'text-base font-bold mt-2.5 mb-1.5' : 'text-sm font-semibold mt-2 mb-1';
          return (
            <h5 key={idx} className={`${sizeClass} text-gray-900 flex items-center gap-1.5`}>
              {depth <= 3 && <span className="w-1 h-3.5 bg-[#7a9e8e] rounded-full inline-block" />}
              <FormattedLine text={headerText} />
            </h5>
          );
        }

        // 2. Check if line is a bullet item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <ul key={idx} className="list-disc pl-5 space-y-1 my-1">
              <li className="marker:text-[#7a9e8e]">
                <FormattedLine text={itemText} />
              </li>
            </ul>
          );
        }

        // 3. Check if line is a numbered item
        if (/^\d+\.\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^\d+\.\s+/, '');
          return (
            <ol key={idx} className="list-decimal pl-5 space-y-1 my-1">
              <li className="marker:text-[#7a9e8e] marker:font-semibold">
                <FormattedLine text={itemText} />
              </li>
            </ol>
          );
        }

        // 4. Normal paragraph line
        return (
          <p key={idx} className="my-1">
            <FormattedLine text={trimmed} />
          </p>
        );
      })}
    </div>
  );
}

// Inner helper to format lines with bold/italic styles
function FormattedLine({ text }: { text: string }) {
  // Simple bold match: **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-bold text-gray-900 bg-emerald-50/40 px-1 py-0.5 rounded border border-emerald-100/30">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

export function ChatbotWindow({ isFullPage = false, onClose }: ChatbotWindowProps) {
  const { user } = useAuth();
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearChat,
    streamingContent,
    streamingProducts,
  } = useChatbot();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Extract initial name letters for avatar
  const getAvatarInitials = () => {
    if (user && user.name) {
      return user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }
    return 'G';
  };

  return (
    <div className={`flex flex-col bg-slate-50/50 backdrop-blur-xl border border-slate-200/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isFullPage ? 'h-[calc(100vh-140px)] min-h-[500px]' : 'h-[580px] w-[380px] sm:w-[420px]'
      }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7a9e8e] to-[#5a7a6b] text-white px-5 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#7a9e8e] shadow-sm animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm tracking-wide">SkinMatch AI Expert</h3>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </div>
            <p className="text-[11px] text-emerald-100 opacity-90">Tư vấn da liễu cá nhân hóa 24/7</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 1 && (
            <button
              onClick={clearChat}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Xóa lịch sử chat"
            >
              <Trash2 size={16} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors font-bold text-lg leading-none cursor-pointer"
              title="Đóng chat"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Messages & Chat Box */}
      <div className="flex-1 overflow-hidden relative flex flex-col min-h-0 bg-[#fdfdfc]/80">
        <ScrollArea className="flex-1 h-full px-4 py-4 scroll-smooth">
          <div className="space-y-5">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${isUser
                      ? 'bg-gradient-to-tr from-[#7a9e8e] to-[#92b5a6] border-emerald-200 text-white font-semibold text-xs'
                      : 'bg-gradient-to-tr from-[#7a9e8e]/10 to-[#5a7a6b]/20 border-emerald-200/50 text-[#7a9e8e]'
                    }`}>
                    {isUser ? (
                      user ? getAvatarInitials() : <UserIcon size={14} />
                    ) : (
                      <Bot size={15} />
                    )}
                  </div>

                  {/* Message content */}
                  <div className="flex flex-col space-y-1.5">
                    <div className={`rounded-2xl px-4 py-2.5 shadow-sm text-[14px] leading-relaxed relative ${isUser
                        ? 'bg-gradient-to-r from-[#7a9e8e] to-[#5a7a6b] text-white rounded-tr-none shadow-emerald-900/5'
                        : 'bg-white border border-gray-100 rounded-tl-none text-gray-800'
                      }`}>
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <MarkdownRenderer text={message.content} />
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className={`text-[10px] text-gray-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                      {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>

                    {/* Recommended Products */}
                    {!isUser && message.products && message.products.length > 0 && (
                      <div className="mt-3.5 space-y-2">
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Sản phẩm chuyên gia gợi ý:</span>
                        </div>
                        {/* Wrap layout for small cards */}
                        <div className="flex flex-wrap gap-2 pt-1 max-w-full">
                          {message.products.map((product) => (
                            <ProductRecommendationCard key={product.id} product={product} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Active Streaming Answer */}
            {isLoading && (streamingContent || streamingProducts.length > 0) && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-tr from-[#7a9e8e]/10 to-[#5a7a6b]/20 border border-emerald-200/50 text-[#7a9e8e] shadow-sm">
                  <Bot size={15} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <div className="rounded-2xl px-4 py-2.5 bg-white border border-gray-100 rounded-tl-none shadow-sm">
                    {streamingContent ? (
                      <MarkdownRenderer text={streamingContent} />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400 py-1">
                        <Loader2 className="w-4 h-4 animate-spin text-[#7a9e8e]" />
                        <span className="text-xs">Đang phân tích cấu trúc da...</span>
                      </div>
                    )}
                  </div>

                  {streamingProducts.length > 0 && (
                    <div className="mt-3.5 space-y-2">
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Sản phẩm chuyên gia gợi ý:</span>
                      </div>
                      {/* Wrap layout for small cards */}
                      <div className="flex flex-wrap gap-2 pt-1 max-w-full">
                        {streamingProducts.map((product) => (
                          <ProductRecommendationCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* General Typing Loader (before content streams in) */}
            {isLoading && !streamingContent && streamingProducts.length === 0 && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-tr from-[#7a9e8e]/10 to-[#5a7a6b]/20 border border-emerald-200/50 text-[#7a9e8e] shadow-sm">
                  <Bot size={15} />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white border border-gray-100 rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Starter cards when chat has only welcome message */}
        {messages.length === 1 && !isLoading && (
          <div className="absolute inset-x-0 bottom-4 px-4 bg-transparent select-none z-10">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 text-center">
              Gợi ý câu hỏi bắt đầu
            </p>
            <div className="grid grid-cols-2 gap-2">
              {STARTER_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q.text);
                    // Focus on input and trigger sendMessage or send it right away
                    setTimeout(() => sendMessage(q.text), 50);
                  }}
                  className="p-2.5 text-left bg-white/90 hover:bg-emerald-50/60 border border-gray-100/70 hover:border-[#7a9e8e]/30 rounded-xl shadow-sm transition-all duration-200 text-xs text-gray-700 hover:text-[#7a9e8e] flex flex-col justify-between group cursor-pointer"
                >
                  <span className="font-semibold text-slate-800 group-hover:text-[#7a9e8e] mb-1 line-clamp-1">{q.short}</span>
                  <span className="text-[10px] text-gray-400 line-clamp-2 leading-normal group-hover:text-[#7a9e8e]/80">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shadow-inner">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Hỏi chuyên gia da liễu..."
          disabled={isLoading}
          className="flex-1 bg-slate-50/80 focus:bg-white text-[13.5px] border border-slate-100 focus:border-[#7a9e8e] focus:ring-1 focus:ring-[#7a9e8e]/30 rounded-xl px-3.5 py-2.5 outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-800 disabled:opacity-60"
        />

        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-[#7a9e8e] hover:bg-[#5a7a6b] disabled:bg-slate-100 text-white disabled:text-gray-300 transition-all duration-200 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-md shadow-emerald-950/5 active:scale-95 disabled:pointer-events-none"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
