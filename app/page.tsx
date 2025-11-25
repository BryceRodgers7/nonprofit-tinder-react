// FRONTEND: Landing page
// Redirects to login or profile page based on authentication status

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/home');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Non-Profit Profile Builder
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create and manage your non-profit organization profile with AI-powered data extraction
        </p>
        
        <div className="flex gap-4 justify-center mb-12">
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Create Account
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-blue-600 text-3xl mb-2">📄</div>
              <h3 className="font-semibold text-gray-900 mb-2">Upload Proposals</h3>
              <p className="text-sm text-gray-600">
                Upload PDF, DOCX, or TXT proposal documents
              </p>
            </div>
            <div>
              <div className="text-blue-600 text-3xl mb-2">🤖</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Extraction</h3>
              <p className="text-sm text-gray-600">
                Automatically extract organization details with GPT-4
              </p>
            </div>
            <div>
              <div className="text-blue-600 text-3xl mb-2">✏️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Editing</h3>
              <p className="text-sm text-gray-600">
                Review and edit your profile information anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

