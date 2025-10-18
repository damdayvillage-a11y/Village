import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET /api/user/achievements - Get user's achievements
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user achievements with achievement details
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: user.id },
      include: {
        achievement: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate total points
    const totalPoints = userAchievements
      .filter(ua => ua.unlockedAt)
      .reduce((sum, ua) => sum + ua.achievement.points, 0);

    // Determine rank based on points
    let rank = 'Beginner';
    if (totalPoints >= 1000) rank = 'Legend';
    else if (totalPoints >= 500) rank = 'Master';
    else if (totalPoints >= 250) rank = 'Expert';
    else if (totalPoints >= 100) rank = 'Advanced';
    else if (totalPoints >= 50) rank = 'Intermediate';

    // Format response
    const formattedAchievements = userAchievements.map(ua => ({
      id: ua.id,
      achievementId: ua.achievementId,
      progress: ua.progress,
      unlockedAt: ua.unlockedAt?.toISOString(),
      achievement: {
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        category: ua.achievement.category,
        points: ua.achievement.points,
      }
    }));

    return NextResponse.json({
      userAchievements: formattedAchievements,
      totalPoints,
      rank,
      unlockedCount: userAchievements.filter(ua => ua.unlockedAt).length,
      totalCount: userAchievements.length,
    });
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
