'use client';

interface UserData {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface ProfileTabProps {
  user: UserData;
}

export function ProfileTab({ user }: ProfileTabProps) {
  return (
    <div className="bg-white rounded-lg p-8 border border-[#e8e5dd]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Profile Information
      </h2>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            defaultValue={user.name}
            className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue={user.email}
            className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Your phone number"
            className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
