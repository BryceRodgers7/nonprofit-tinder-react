// FRONTEND: Home page
// Welcome page shown to users after login

'use client';

import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/app/profile/components/ProtectedRoute';
import NavBar from '@/app/components/NavBar';

function HomePageContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover and connect with non-profit organizations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h2 className="text-2xl font-semibold text-blue-900 mb-3">
                Your Profile
              </h2>
              <p className="text-gray-700 mb-4">
                Create and manage your non-profit organization profile. Upload proposal documents and let AI extract the information automatically.
              </p>
              <a
                href="/profile"
                className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Profile
              </a>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
              <h2 className="text-2xl font-semibold text-green-900 mb-3">
                Discover Organizations
              </h2>
              <p className="text-gray-700 mb-4">
                Swipe through other non-profit organizations and like the ones you're interested in connecting with.
              </p>
              <a
                href="/swipe"
                className="inline-block px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Start Swiping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}

