// TEMPORARY DATABASE INITIALIZATION
// This file ensures database tables exist on first run
// ⚠️ REMOVE THIS FILE AND ITS USAGE ONCE DATABASE IS PROPERLY SET UP

import { prisma } from './prisma';

let isInitialized = false;

/**
 * Ensures database tables exist by checking and creating if necessary
 * This is a temporary solution - remove once proper migrations are run
 */
export async function ensureDatabaseTables(): Promise<void> {
  // Only run once per server instance
  // if (isInitialized) {
  //   return;
  // }

  // try {
  //   // Test if the Resume table exists by trying to count records
  //   await prisma.resume.count();
  //   isInitialized = true;
  //   console.log('✅ Database tables verified');
  // } catch (error) {
  //   console.log('⚠️ Database tables not found, attempting to create...');
    
  //   try {
  //     // Create the resumes table using raw SQL
  //     await prisma.$executeRawUnsafe(`
  //       CREATE TABLE IF NOT EXISTS "resumes" (
  //         "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  //         "fileName" TEXT NOT NULL,
  //         "fileType" TEXT NOT NULL,
  //         "fullName" TEXT,
  //         "email" TEXT,
  //         "phone" TEXT,
  //         "lastJob" TEXT,
  //         "lastCompany" TEXT,
  //         "yearsExperience" TEXT,
  //         "technicalSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
  //         "education" TEXT,
  //         "summary" TEXT,
  //         "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //         "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  //       );
  //     `);

  //     // Create updated_at trigger
  //     await prisma.$executeRawUnsafe(`
  //       CREATE OR REPLACE FUNCTION update_updated_at_column()
  //       RETURNS TRIGGER AS $$
  //       BEGIN
  //         NEW."updatedAt" = CURRENT_TIMESTAMP;
  //         RETURN NEW;
  //       END;
  //       $$ language 'plpgsql';
  //     `);

  //     await prisma.$executeRawUnsafe(`
  //       DROP TRIGGER IF EXISTS update_resumes_updated_at ON "resumes";
  //       CREATE TRIGGER update_resumes_updated_at
  //       BEFORE UPDATE ON "resumes"
  //       FOR EACH ROW
  //       EXECUTE FUNCTION update_updated_at_column();
  //     `);

  //     isInitialized = true;
  //     console.log('✅ Database tables created successfully');
  //   } catch (createError) {
  //     console.error('❌ Failed to create database tables:', createError);
  //     throw new Error('Database initialization failed. Please run: npx prisma migrate dev');
  //   }
  // }
}

/**
 * Reset the initialization state (useful for testing)
 */
export function resetInitialization(): void {
  isInitialized = false;
}

