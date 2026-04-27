"use client";
import Link from 'next/link';
import Image from 'next/image';
import { GlassCard } from './ui/glass-container';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center pt-16 pb-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background_hero.png"
          alt="Lush green backgrounds"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        {/* Subtle radial gradient to make content pop */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-white/10" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Hero Title: TRUE [Leaf] ESSENCE */}
        <div className="flex flex-col items-center justify-center mb-8 text-gray-900">
          <h1 className="flex items-center justify-center gap-4 md:gap-8 text-[40px] sm:text-[70px] md:text-[100px] lg:text-[120px] font-bold leading-none tracking-tight whitespace-nowrap">
            <div className="flex">
              {"TRUE".split("").map((char, i) => (
                <motion.span 
                  key={i}
                  className="opacity-90 inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            
            <motion.div 
              className="relative w-[10vw] h-[10vw] max-w-[80px] max-h-[80px] md:max-w-[120px] md:max-h-[120px]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full fill-[#5a7a6b] drop-shadow-xl animate-pulse-slow">
                <path d="M50 10 C50 10 90 20 90 50 C90 80 50 90 50 90 C50 90 10 80 10 50 C10 20 50 10 50 10 Z" />
                <path d="M50 10 Q50 40 50 90" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                <path d="M50 10 C30 30 20 50 10 50" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
                <path d="M50 10 C70 30 80 50 90 50" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-4xl md:text-7xl mb-4">🍃</span>
              </div>
            </motion.div>

            <div className="flex">
              {"ESSENCE".split("").map((char, i) => (
                <motion.span 
                  key={i}
                  className="opacity-90 inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + (i * 0.06), duration: 0.3 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </h1>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end relative">
          {/* Center: Woman Image */}
          <div className="md:col-span-6 order-1 md:order-2 flex flex-col items-center relative -mt-5 translate-x-1/2 z-20">
            <motion.div 
              className="relative w-full ms-50 aspect-[4/5] max-w-[370px] h-[460px] rounded-[40px] shadow-2xl border-[25px] border-white/20 group bg-[#eef4e8] overflow-visible"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.5 }}
            >
              <Image
                src="/woman-hero.png"
                alt="Woman with natural glowing skin"
                fill
                priority
                className="z-20 object-cover mt-6 object-bottom scale-[1.3] -ms-12 origin-bottom transition-transform duration-700"
              />
            </motion.div>

            {/* Floating Product Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.5, ease: "easeOut" }}
              className="absolute bottom-4 -left-10 md:-left-20 z-30"
            >
              <GlassCard 
                blur={5}
                opacity={0.28}
                borderOpacity={0.3}
                borderRadius={20}
                variant="none"
                className="w-36 md:w-50 md:h-75 p-6 shadow-2xl transition-all duration-300"
              >
                <motion.div 
                  className="relative aspect-square w-full mb-4 -mt-10"
                  initial={{ opacity: 0, rotate: 0, scale: 0.4 }}
                  animate={{ opacity: 1, rotate: -12, scale: 1 }}
                  transition={{ delay: 2.3, duration: 0.6, type: "spring", stiffness: 100 }}
                >
                    <Image
                      src="/image-product-demo.png"
                      alt="Liora Face Cream tube"
                      fill
                      className="object-contain scale-250 drop-shadow-lg"
                    />
                </motion.div>
                <motion.div 
                  className="text-center space-y-1 mt-23 px-2"
                >
                    <p className="text-md font-bold text-white/80 pt-2 leading-tight flex flex-wrap justify-center">
                      {"Pure care, powered by nature.".split(" ").map((word, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: 2.5 + (i * 0.06), 
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                          className="mr-1.5"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </p>
                </motion.div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 opacity-50">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
      </div>

    </section>
  );
}
