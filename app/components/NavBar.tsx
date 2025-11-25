// FRONTEND: Navigation bar component
// Provides navigation links to Home, Profile, and Swipe pages

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const linkClass = (path: string) => {
    const baseClass = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
    if (isActive(path)) {
      return `${baseClass} bg-blue-700 text-white`;
    }
    return `${baseClass} text-blue-100 hover:bg-blue-600 hover:text-white`;
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Navigation Links */}
          <div className="flex space-x-2">
            <Link href="/home" className={linkClass('/home')}>
              Home
            </Link>
            <Link href="/profile" className={linkClass('/profile')}>
              Profile
            </Link>
            <Link href="/swipe" className={linkClass('/swipe')}>
              Swipe
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-blue-100 text-sm">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

