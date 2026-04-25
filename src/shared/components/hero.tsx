import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#f5f2ed] via-[#faf8f5] to-[#f5f2ed] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-[#7a9e8e]">TRUE</span>
                <span className="block">ESSENCE</span>
              </h1>
              <div className="w-12 h-1 bg-[#c9b896]"></div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed max-w-md">
              We believe beauty should be kind — to your skin and to the planet
            </p>

            <div className="pt-4">
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition"
              >
                Shop Now
              </Link>
            </div>

            {/* Features */}
            <div className="pt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7a9e8e] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-gray-700 text-sm">Includes only natural products</p>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=700&fit=crop"
                alt="Natural skincare product"
                fill
                className="object-cover"
              />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 lg:-bottom-12 lg:-left-12 bg-white rounded-2xl shadow-xl p-6 max-w-xs hidden lg:block">
              <p className="text-sm text-gray-700 mb-4">
                Pure care, powered by nature.
              </p>
              <div className="flex gap-3 flex-wrap">
                <span className="px-3 py-1 bg-[#f5f2ed] text-[#7a9e8e] text-xs font-semibold rounded-full">
                  Vegan
                </span>
                <span className="px-3 py-1 bg-[#f5f2ed] text-[#7a9e8e] text-xs font-semibold rounded-full">
                  Eco-pack
                </span>
                <span className="px-3 py-1 bg-[#f5f2ed] text-[#7a9e8e] text-xs font-semibold rounded-full">
                  Cruelty-free
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#a8bfb5]/10 to-transparent rounded-full -mr-40 -mb-40 hidden lg:block"></div>
    </section>
  );
}
