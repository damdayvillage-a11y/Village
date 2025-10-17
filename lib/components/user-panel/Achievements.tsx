'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Trophy,
  Star,
  Target,
  TrendingUp,
  Users,
  Leaf,
  Heart,
  BookOpen,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

interface UserAchievement {
  id: string;
  achievementId: string;
  progress: number;
  unlockedAt?: string;
  achievement: Achievement;
}

interface AchievementsProps {
  userAchievements: UserAchievement[];
  totalPoints: number;
  rank?: string;
}

export function Achievements({
  userAchievements,
  totalPoints,
  rank = 'Beginner'
}: AchievementsProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unlocked' | 'locked'>('all');

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'trophy':
        return <Trophy className="h-8 w-8" />;
      case 'star':
        return <Star className="h-8 w-8" />;
      case 'target':
        return <Target className="h-8 w-8" />;
      case 'trending':
        return <TrendingUp className="h-8 w-8" />;
      case 'users':
        return <Users className="h-8 w-8" />;
      case 'leaf':
        return <Leaf className="h-8 w-8" />;
      case 'heart':
        return <Heart className="h-8 w-8" />;
      case 'book':
        return <BookOpen className="h-8 w-8" />;
      default:
        return <Award className="h-8 w-8" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'RARE':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'EPIC':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'LEGENDARY':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'RARE':
        return 'shadow-lg shadow-blue-200';
      case 'EPIC':
        return 'shadow-lg shadow-purple-200';
      case 'LEGENDARY':
        return 'shadow-xl shadow-yellow-200';
      default:
        return '';
    }
  };

  const unlockedAchievements = userAchievements.filter(ua => ua.unlockedAt);
  const lockedAchievements = userAchievements.filter(ua => !ua.unlockedAt);

  const filteredAchievements = userAchievements.filter(ua => {
    const categoryMatch = filterCategory === 'all' || ua.achievement.category === filterCategory;
    const statusMatch = 
      filterStatus === 'all' || 
      (filterStatus === 'unlocked' && ua.unlockedAt) ||
      (filterStatus === 'locked' && !ua.unlockedAt);
    return categoryMatch && statusMatch;
  });

  const categories = ['all', ...new Set(userAchievements.map(ua => ua.achievement.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="h-7 w-7 text-yellow-600" />
          Achievements & Badges
        </h2>
        <p className="text-gray-600 mt-1">Track your progress and unlock rewards</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Total Points</p>
                <p className="text-3xl font-bold text-yellow-900">{totalPoints}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Unlocked</p>
                <p className="text-2xl font-bold text-gray-900">
                  {unlockedAchievements.length}/{userAchievements.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Current Rank</p>
                <p className="text-2xl font-bold text-gray-900">{rank}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                    filterCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('unlocked')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterStatus === 'unlocked'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                Unlocked
              </button>
              <button
                onClick={() => setFilterStatus('locked')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterStatus === 'locked'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Locked
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((userAchievement) => {
          const { achievement } = userAchievement;
          const isUnlocked = !!userAchievement.unlockedAt;

          return (
            <Card
              key={userAchievement.id}
              className={`transition-all hover:scale-105 ${
                isUnlocked ? getRarityGlow(achievement.rarity) : 'opacity-60'
              }`}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-4 rounded-full mb-4 ${
                      isUnlocked
                        ? getRarityColor(achievement.rarity)
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isUnlocked ? (
                      getAchievementIcon(achievement.icon)
                    ) : (
                      <Lock className="h-8 w-8" />
                    )}
                  </div>

                  {/* Name and Rarity */}
                  <div className="mb-2">
                    <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gray-900' : 'text-gray-600'}`}>
                      {achievement.name}
                    </h3>
                    <Badge className={`mt-1 ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className={`text-sm mb-4 ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>

                  {/* Points */}
                  <div className="flex items-center justify-center gap-1 text-yellow-600 font-semibold">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{achievement.points} points</span>
                  </div>

                  {/* Progress or Unlock Date */}
                  {isUnlocked ? (
                    <p className="text-xs text-green-600 font-medium mt-3">
                      Unlocked on {new Date(userAchievement.unlockedAt!).toLocaleDateString()}
                    </p>
                  ) : (
                    <div className="mt-4">
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-primary-600 transition-all"
                          style={{ width: `${userAchievement.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {userAchievement.progress}% Complete
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No achievements found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
