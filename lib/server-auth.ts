// BACKEND: Server-side authentication utilities
// For use in Server Components, Server Actions, and Route Handlers

import { cookies } from 'next/headers';
import { verifyToken, JWTPayload } from './auth';

/**
 * Get the current user from cookies in a Server Component
 * Returns the user payload or null if not authenticated
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const payload = verifyToken(token);
    return payload;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

/**
 * Get the current user's ID from cookies
 * Returns the userId or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.userId || null;
}

/**
 * Require authentication in a Server Component
 * Throws an error if not authenticated (for use with error boundaries)
 */
export async function requireServerAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

