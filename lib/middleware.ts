// BACKEND: Middleware utilities
// JWT verification and route protection

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Verify JWT token from request and return user info
 * Checks cookies first, then Authorization header for backwards compatibility
 * Returns null if token is invalid or missing
 */
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  // Try to get token from cookie first
  let token = request.cookies.get('auth-token')?.value;
  
  // Fall back to Authorization header if cookie not found
  if (!token) {
    const authHeader = request.headers.get('authorization');
    token = extractTokenFromHeader(authHeader);
  }
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

/**
 * Require authentication for a route
 * Returns error response if not authenticated, otherwise returns user info
 */
export function requireAuth(request: NextRequest): { user: JWTPayload } | NextResponse {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }
  
  return { user };
}

