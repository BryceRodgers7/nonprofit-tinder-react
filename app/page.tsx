// FRONTEND: Coming Soon Landing Page
// Shows at root while keeping other pages accessible for development

'use client';

import { useState } from 'react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Main Content */}
        <div className="mb-8">
          <div className="inline-block animate-bounce mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-4xl">🚀</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Coming Soon
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-light">
            We're building something amazing
          </p>
          
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
            Our platform is currently under development. We're working hard to bring you 
            an incredible experience that will transform how nonprofits connect with donors.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-5xl mb-4">💝</div>
            <h3 className="text-white font-semibold text-lg mb-2">Smart Matching</h3>
            <p className="text-white/80 text-sm">
              Connect nonprofits with the right donors
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-white font-semibold text-lg mb-2">AI-Powered</h3>
            <p className="text-white/80 text-sm">
              Intelligent profile creation and analysis
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-white font-semibold text-lg mb-2">Fast & Easy</h3>
            <p className="text-white/80 text-sm">
              Streamlined experience for everyone
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
          <p className="text-white text-lg mb-4 font-semibold">
            Want to be notified when we launch?
          </p>
          <p className="text-white/70 text-sm mb-6">
            Enter your email below and we'll let you know!
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Notify Me'}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-500/20 text-white border border-green-400/30'
                  : 'bg-red-500/20 text-white border border-red-400/30'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Givio. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

