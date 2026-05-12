'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import { Sparkles, Brain, ShieldCheck, Heart, Leaf, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-16">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[#f5f2ed]/60 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(#7a9e8e_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <span className="px-3 py-1 bg-[#7a9e8e]/10 text-[#326e51] text-xs font-bold uppercase tracking-wider rounded-full mb-4 inline-block">
              Về Chúng Tôi
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-none mb-6">
              Định Nghĩa Lại <br />
              <span className="bg-gradient-to-r from-[#326e51] to-[#7a9e8e] bg-clip-text text-transparent">
                Chăm Sóc Da Cá Nhân Hóa
              </span>
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
              Liora SkinMatch ra đời với sứ mệnh mang đến giải pháp chăm sóc da hoàn hảo nhất cho riêng bạn. 
              Sự kết hợp đỉnh cao giữa nguồn tinh chất thiên nhiên tinh khiết và công nghệ trí tuệ nhân tạo (AI) đột phá 
              giúp làn da bạn được nuôi dưỡng chuẩn xác khoa học nhất.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/chatbot"
                className="px-8 py-3.5 bg-[#7a9e8e] hover:bg-[#326e51] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#7a9e8e]/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                Trò chuyện với AI Expert
              </Link>
              <Link
                href="/products"
                className="px-8 py-3.5 bg-white border-2 border-gray-100 text-[#4a4a4a] hover:border-[#7a9e8e] font-bold text-sm rounded-2xl transition-all duration-300"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          </div>
        </section>

        {/* Our Vision and Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              {/* Illustration Card */}
              <div className="relative aspect-video sm:aspect-square bg-gradient-to-tr from-[#7a9e8e]/20 to-[#f5f2ed] rounded-3xl p-8 flex items-center justify-center overflow-hidden border border-[#7a9e8e]/10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)]" />
                <div className="relative text-center max-w-sm space-y-4">
                  <div className="w-16 h-16 bg-[#7a9e8e] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <Brain size={32} />
                  </div>
                  <h4 className="font-extrabold text-xl text-gray-900">SkinMatch AI Algorithm</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Thuật toán phân tích thành phần độc quyền, liên tục tối ưu hóa theo tiến bộ lâm sàng để đề xuất chu trình skincare hoàn chỉnh cho từng cấu trúc da riêng biệt.
                  </p>
                </div>
              </div>

              {/* Story Content */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                  Khi Thiên Nhiên Gặp Gỡ <br className="hidden sm:inline" />
                  Công Nghệ Trí Tuệ Nhân Tạo
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Mỗi người sở hữu một cấu trúc da độc bản. Việc sử dụng các sản phẩm mỹ phẩm theo số đông hoặc trào lưu thường không mang lại hiệu quả tối ưu, thậm chí gây tổn thương hàng rào bảo vệ da.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Tại **Liora SkinMatch**, chúng tôi thấu hiểu sâu sắc điều đó. Chúng tôi xây dựng một cơ sở dữ liệu khổng lồ về thành phần hoạt chất kết hợp cùng mô hình ngôn ngữ lớn RAG chuyên sâu. Khi bạn tương tác với Chatbot của chúng tôi, AI không chỉ tư vấn, mà đang thực hiện một buổi khám da liễu cá nhân chuẩn xác cao.
                </p>

                {/* Core Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                  <div className="text-center sm:text-left">
                    <p className="text-2xl sm:text-3xl font-black text-[#326e51]">99.8%</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Độ Chính Xác</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-2xl sm:text-3xl font-black text-[#326e51]">20k+</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Khách Hàng</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-2xl sm:text-3xl font-black text-[#326e51]">100%</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">An Toàn Lành Tính</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Giá Trị Cốt Lõi Của Chúng Tôi
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-sm mt-2">
                Những nguyên tắc chuẩn mực làm nên thương hiệu Liora chăm sóc da khoa học
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Value card 1 */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#7a9e8e]/10 text-[#326e51] flex items-center justify-center mb-5">
                  <Leaf size={22} className="fill-[#326e51]/10" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">Thực Vật Tự Nhiên</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Cam kết chiết xuất từ thiên nhiên lành tính, không hương liệu tổng hợp, không paraben, nuôi dưỡng làn da khỏe mạnh từ bên trong.
                </p>
              </div>

              {/* Value card 2 */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#7a9e8e]/10 text-[#326e51] flex items-center justify-center mb-5">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">Cá Nhân Hóa Tối Đa</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Không áp dụng chu trình rập khuôn. Chu trình dưỡng da được thiết kế chuyên biệt dựa trên độ ẩm, độ pH và lối sống cá nhân của bạn.
                </p>
              </div>

              {/* Value card 3 */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#7a9e8e]/10 text-[#326e51] flex items-center justify-center mb-5">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">Khoa Học Kiểm Chứng</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Đội ngũ chuyên gia da liễu luôn cùng đồng hành kiểm chứng độ tương thích và hiệu quả thực tế lâm sàng của các hoạt chất.
                </p>
              </div>

              {/* Value card 4 */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#7a9e8e]/10 text-[#326e51] flex items-center justify-center mb-5">
                  <Heart size={22} />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">Trách Nhiệm Xanh</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Sử dụng bao bì tái chế 100%, bảo vệ môi trường sinh thái và thúc đẩy xu hướng làm đẹp bền vững, thuần chay sạch.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Technology Deep Dive */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#7a9e8e] to-[#326e51] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -left-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
              
              <div className="max-w-3xl relative z-10 space-y-6">
                <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full inline-block">
                  CÔNG NGHỆ CHATBOT THẾ HỆ MỚI
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                  Khám Phá Bác Sĩ Da Liễu AI 24/7
                </h2>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                  Trò chuyện trực tuyến để nhận phân tích chi tiết về làn da, gợi ý giải pháp điều trị mụn, thâm, chống lão hóa, và nhận đề xuất danh sách mỹ phẩm phù hợp nhất. Tất cả đều miễn phí, bảo mật cao và tức thì thông qua công nghệ của chúng tôi.
                </p>
                <div className="pt-4">
                  <Link
                    href="/chatbot"
                    className="inline-block px-8 py-3.5 bg-white text-[#326e51] hover:bg-[#faf9f6] font-extrabold text-sm rounded-2xl transition duration-300 transform hover:scale-105"
                  >
                    Trải Nghiệm Ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
