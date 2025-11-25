// BACKEND: User logout API route
// Since we're using JWT, logout is handled client-side by removing the token
// This endpoint exists for consistency and future enhancement (e.g., token blacklist)

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
}

