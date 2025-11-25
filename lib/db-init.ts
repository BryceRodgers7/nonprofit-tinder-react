// TEMPORARY DATABASE INITIALIZATION
// This file ensures database tables exist on first run
// ⚠️ REMOVE THIS FILE AND ITS USAGE ONCE DATABASE IS PROPERLY SET UP

import { prisma } from './prisma';

let isInitialized = false;

/**
 * Reset the initialization state (useful for testing)
 */
export function resetInitialization(): void {
  isInitialized = false;
}

