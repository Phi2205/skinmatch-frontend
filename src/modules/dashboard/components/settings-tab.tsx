'use client';

import Link from 'next/link';

export function SettingsTab() {
  return (
    <div className="bg-white rounded-lg p-8 border border-[#e8e5dd]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Settings
      </h2>

      <div className="space-y-6">
        {/* Notifications */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            Email Preferences
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-700">
                Order updates
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-700">
                Product recommendations
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-700">
                Promotional offers
              </span>
            </label>
          </div>
        </div>

        {/* Skin Profile */}
        <div className="pt-6 border-t border-[#e8e5dd]">
          <h3 className="font-semibold text-gray-900 mb-4">
            Skin Profile
          </h3>
          <Link
            href="/onboarding/skin-profile"
            className="inline-block px-6 py-2 bg-[#7a9e8e] text-[#ffffff] font-semibold rounded-lg hover:bg-[#5a7a6b] transition cursor-pointer"
          >
            Update Skin Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
