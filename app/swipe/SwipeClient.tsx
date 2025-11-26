// FRONTEND: Swipe Client Component
// Handles interactive swiping UI - receives initial data from Server Component

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/app/profile/components/ProtectedRoute';
import NavBar from '@/app/components/NavBar';

interface Profile {
  id: string;
  organizationName: string | null;
  missionStatement: string | null;
  locationServed: string | null;
  oneSentenceSummary: string | null;
  biggestAccomplishment: string | null;
  user: {
    username: string;
    name: string;
  };
}

interface SwipeClientProps {
  initialProfiles: Profile[];
}

function SwipeClientContent({ initialProfiles }: SwipeClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshProfiles = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch('/api/swipe/profiles', {
        credentials: 'include', // Auth via HttpOnly cookie
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }

      const data = await response.json();
      setProfiles(data.profiles);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAction = async (action: 'like' | 'pass') => {
    if (isSubmitting || currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];
    setIsSubmitting(true);
    setError(null);

    // Trigger animation
    setAnimationClass(action === 'like' ? 'swipe-right' : 'swipe-left');

    try {
      const response = await fetch('/api/swipe/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Auth via HttpOnly cookie
        body: JSON.stringify({
          profileId: currentProfile.id,
          action: action,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record action');
      }

      // Wait for animation to complete
      setTimeout(() => {
        setAnimationClass('');
        setCurrentIndex(prev => prev + 1);
        setIsSubmitting(false);

        // If we've reached the end, refresh profiles
        if (currentIndex + 1 >= profiles.length) {
          refreshProfiles();
        }
      }, 300);

    } catch (error) {
      console.error('Error recording action:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setAnimationClass('');
      setIsSubmitting(false);
    }
  };

  const currentProfile = profiles[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {profiles.length === 0 && !isRefreshing && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No More Profiles
            </h2>
            <p className="text-gray-600 mb-6">
              You've seen all available profiles. Check back later for more organizations!
            </p>
            <button
              onClick={refreshProfiles}
              disabled={isRefreshing}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        )}

        {currentProfile && (
          <div className="relative">
            {/* Profile Card */}
            <div className={`bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${animationClass}`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <h1 className="text-3xl font-bold mb-2">
                  {currentProfile.organizationName || 'Unnamed Organization'}
                </h1>
                <p className="text-blue-100 text-sm">
                  @{currentProfile.user.username}
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {currentProfile.oneSentenceSummary && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Summary
                    </h3>
                    <p className="text-gray-900 text-lg">
                      {currentProfile.oneSentenceSummary}
                    </p>
                  </div>
                )}

                {currentProfile.missionStatement && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Mission Statement
                    </h3>
                    <p className="text-gray-700">
                      {currentProfile.missionStatement}
                    </p>
                  </div>
                )}

                {currentProfile.locationServed && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Location Served
                    </h3>
                    <p className="text-gray-700">
                      {currentProfile.locationServed}
                    </p>
                  </div>
                )}

                {currentProfile.biggestAccomplishment && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Biggest Accomplishment
                    </h3>
                    <p className="text-gray-700">
                      {currentProfile.biggestAccomplishment}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-gray-50 flex justify-center gap-8">
                <button
                  onClick={() => handleAction('pass')}
                  disabled={isSubmitting}
                  className="w-20 h-20 rounded-full bg-white border-4 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:scale-110"
                  title="Pass"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <button
                  onClick={() => handleAction('like')}
                  disabled={isSubmitting}
                  className="w-20 h-20 rounded-full bg-white border-4 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:scale-110"
                  title="Like"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {currentIndex + 1} of {profiles.length}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes swipeLeft {
          to {
            transform: translateX(-150%) rotate(-20deg);
            opacity: 0;
          }
        }

        @keyframes swipeRight {
          to {
            transform: translateX(150%) rotate(20deg);
            opacity: 0;
          }
        }

        .swipe-left {
          animation: swipeLeft 0.3s ease-out;
        }

        .swipe-right {
          animation: swipeRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function SwipeClient({ initialProfiles }: SwipeClientProps) {
  return (
    <ProtectedRoute>
      <SwipeClientContent initialProfiles={initialProfiles} />
    </ProtectedRoute>
  );
}

