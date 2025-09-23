import { GameScenario, GameItem } from '@/types/game';

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateScenarioFromPrompt = async (prompt: string): Promise<GameScenario | null> => {
  try {
    // This would integrate with ChatGPT API
    const apiResponse = await fetch('/api/generate-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!apiResponse.ok) {
      throw new Error('Failed to generate game scenario');
    }

    const data = await apiResponse.json();
    return data.scenario;
  } catch (error) {
    console.error('Error generating scenario:', error);
    return null;
  }
};

export const calculateScore = (
  isCorrect: boolean,
  timeSeconds: number,
  difficulty: 'easy' | 'medium' | 'hard'
): number => {
  if (!isCorrect) return 0;

  const baseScore = {
    easy: 10,
    medium: 15,
    hard: 20,
  }[difficulty];

  // Bonus points for speed (max 5 bonus points)
  const speedBonus = Math.max(0, 5 - Math.floor(timeSeconds / 2));

  return baseScore + speedBonus;
};

export const checkAchievements = (
  userProgress: any,
  gameResult: {
    isCorrect: boolean;
    timeSeconds: number;
    difficulty: string;
    category: string;
  }
): string[] => {
  const newAchievements: string[] = [];

  // First game achievement
  if (userProgress.gamesPlayed === 1) {
    newAchievements.push('first-game');
  }

  // Speed achievement
  if (gameResult.isCorrect && gameResult.timeSeconds <= 5) {
    newAchievements.push('speed-demon');
  }

  // Streak achievements
  if (userProgress.streak >= 10) {
    newAchievements.push('sharp-eye');
  }

  // Category-specific achievements
  const categoryGames = userProgress.categoryStats?.[gameResult.category]?.gamesPlayed || 0;
  if (categoryGames >= 20) {
    newAchievements.push(`${gameResult.category}-expert`);
  }

  return newAchievements;
};