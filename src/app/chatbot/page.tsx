'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import { ChatbotWindow } from '@/modules/chatbot/components/chatbot-window';
import { Sparkles, Shield, HeartPulse, Sparkle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans">
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Side: Aesthetic Marketing / Instructions */}
        <div className="flex-1 flex flex-col justify-center space-y-6 lg:pr-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-[#7a9e8e] w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ĐỘT PHÁ CÔNG NGHỆ LÀN DA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Chuyên Gia Tư Vấn <br />
            <span className="text-[#7a9e8e] bg-gradient-to-r from-[#7a9e8e] to-[#5a7a6b] bg-clip-text text-transparent">Da Liễu AI Cá Nhân</span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg">
            Được trang bị cơ sở dữ liệu dồi dào về thành phần mỹ phẩm và hoạt chất khoa học, SkinMatch AI sẵn sàng lắng nghe, phân tích các vấn đề da dẻ của bạn và thiết kế chu trình Skincare hoàn hảo nhất.
          </p>

          {/* Benefits Bullet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm border border-white rounded-xl shadow-sm">
              <div className="p-2 bg-emerald-50 rounded-lg text-[#7a9e8e]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 mb-0.5">Tư vấn khoa học</h4>
                <p className="text-[11px] text-gray-500 leading-normal">Giải thích dựa trên hoạt chất sinh học thực tế.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm border border-white rounded-xl shadow-sm">
              <div className="p-2 bg-emerald-50 rounded-lg text-[#7a9e8e]">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 mb-0.5">Cá nhân hóa cao</h4>
                <p className="text-[11px] text-gray-500 leading-normal">Khuyến nghị sản phẩm chuẩn xác theo cơ địa da.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200/50 hidden lg:block">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Sparkle className="w-3.5 h-3.5 text-[#7a9e8e]" />
              <span>Dữ liệu chu trình cập nhật liên tục dựa trên tiến bộ lâm sàng.</span>
            </div>
          </div>
        </div>

        {/* Right Side: High fidelity Chat Window in Full Sized Panel */}
        <div className="w-full lg:w-[500px] xl:w-[550px] flex-shrink-0 flex flex-col justify-center">
          <ChatbotWindow isFullPage={true} />
        </div>

      </main>

      <Footer />
    </div>
  );
}
