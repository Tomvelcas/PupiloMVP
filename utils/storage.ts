import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, GameScenario } from '@/types/game';

const STORAGE_KEYS = {
  USER_PROGRESS: 'userProgress',
  SETTINGS: 'settings',
  CUSTOM_SCENARIOS: 'customScenarios',
};

export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
};

export const getUserProgress = async (): Promise<UserProgress | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user progress:', error);
    return null;
  }
};

export const saveSettings = async (settings: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const getSettings = async (): Promise<any> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      soundEnabled: true,
      hapticEnabled: true,
      difficulty: 'easy',
      parentalControls: false,
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      soundEnabled: true,
      hapticEnabled: true,
      difficulty: 'easy',
      parentalControls: false,
    };
  }
};

export const saveCustomScenario = async (scenario: GameScenario): Promise<void> => {
  try {
    const existingScenarios = await getCustomScenarios();
    const updatedScenarios = [...existingScenarios, scenario];
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_SCENARIOS, JSON.stringify(updatedScenarios));
  } catch (error) {
    console.error('Error saving custom scenario:', error);
  }
};

export const getCustomScenarios = async (): Promise<GameScenario[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_SCENARIOS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading custom scenarios:', error);
    return [];
  }
};