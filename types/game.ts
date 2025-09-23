export interface GameItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  isOddOne: boolean;
}

export interface GameScenario {
  id: string;
  title: string;
  items: GameItem[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface UserProgress {
  totalScore: number;
  gamesPlayed: number;
  accuracy: number;
  streak: number;
  categoriesUnlocked: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedDate?: Date;
}

export interface CategoryStats {
  categoryId: string;
  name: string;
  gamesPlayed: number;
  accuracy: number;
  averageTime: number;
  bestStreak: number;
}