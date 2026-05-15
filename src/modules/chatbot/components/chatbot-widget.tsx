'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, MessageSquare, X, Sparkles } from 'lucide-react';
import { ChatbotWindow } from './chatbot-window';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide floating widget on dedicated chatbot page or admin pages
  if (pathname === '/chatbot' || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className={`fixed z-50 flex flex-col items-end gap-3 font-sans transition-all duration-300 ${isOpen ? 'inset-0 md:inset-auto md:bottom-6 md:right-6' : 'bottom-24 md:bottom-6 right-4 md:right-6'}`}>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="fixed inset-0 z-[60] md:relative md:inset-auto md:z-auto origin-bottom-right"
          >
            <ChatbotWindow isFullPage={false} onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen
            ? 'bg-slate-800 text-white hidden md:flex'
            : 'bg-gradient-to-tr from-[#7a9e8e] via-[#6a8e7e] to-[#5a7a6b] text-white hover:brightness-110 flex'
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ scale: 0.6, rotate: 45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.6, rotate: -45, opacity: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 300 }}
              className="flex items-center justify-center"
            >
              <Bot size={24} strokeWidth={2} />
              
              {/* Sparkle badge */}
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 rounded-full p-1 border-2 border-white shadow-sm">
                <Sparkles size={8} fill="currentColor" />
              </div>

              {/* Pulsing outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#7a9e8e] animate-ping opacity-25 -z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
export default ChatbotWidget;
