// FRONTEND: Swipe page
// Server Component fetches initial data, Client Component handles interactivity

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/server-auth';
import SwipeClient from './SwipeClient';

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

async function getSwipeProfiles(userId: string): Promise<Profile[]> {
  // Fetch profiles directly from database in Server Component
  const profiles = await prisma.profile.findMany({
    where: {
      userId: {
        not: userId,
      },
      organizationName: {
        not: null,
      },
    },
    include: {
      user: {
        select: {
          username: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return profiles;
}

export default async function SwipePage() {
  // Server-side authentication check using cookie
  const userId = await getCurrentUserId();
  
  if (!userId) {
    redirect('/auth/login');
  }

  // Fetch initial profiles on server
  const initialProfiles = await getSwipeProfiles(userId);

  // Pass data to Client Component
  return <SwipeClient initialProfiles={initialProfiles} />;
}
