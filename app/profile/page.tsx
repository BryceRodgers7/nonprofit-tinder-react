// FRONTEND: Profile page
// Server Component fetches initial profile data, Client Component handles forms/uploads

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/server-auth';
import ProfileClient from './ProfileClient';
import { ProfileData } from './components/ProfileForm';

async function getProfile(userId: string): Promise<ProfileData | null> {
  // Fetch profile directly from database in Server Component
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
    select: {
      fileName: true,
      s3Key: true,
      s3Url: true,
      organizationName: true,
      ein: true,
      missionStatement: true,
      yearFounded: true,
      locationServed: true,
      biggestAccomplishment: true,
      oneSentenceSummary: true,
      legalDesignation: true,
      primaryCauseAreas: true,
      populations: true,
      geographicalFocus: true,
    },
  });

  if (!profile) {
    return null;
  }

  return profile;
}

export default async function ProfilePage() {
  // Server-side authentication check using cookie
  const userId = await getCurrentUserId();
  
  if (!userId) {
    redirect('/auth/login');
  }

  // Fetch initial profile on server
  const initialProfile = await getProfile(userId);

  // Pass data to Client Component
  return <ProfileClient initialProfile={initialProfile} />;
}
