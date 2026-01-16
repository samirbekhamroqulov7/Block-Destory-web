import { GameConfig, DeviceInfo } from '../types/gameTypes';

export const getGameConfig = (deviceInfo: DeviceInfo): GameConfig => {
  const { isTablet } = deviceInfo;
  
  return {
    ballSpeed: isTablet ? 7 : 8, // На планшетах чуть медленнее для комфортной игры
    paddleSpeed: isTablet ? 12 : 15,
    brickRows: isTablet ? 5 : 4, // На планшетах больше рядов
    brickCols: isTablet ? 7 : 6, // На планшетах больше колонок
    initialLives: 3,
    brickHealth: 1
  };
};

export const BRICK_COLORS = [
  '#FF6B6B', // Красный
  '#4ECDC4', // Бирюзовый
  '#FFD166', // Желтый
  '#06D6A0', // Зеленый
  '#118AB2', // Синий
  '#EF476F', // Розовый
  '#8338EC', // Фиолетовый
  '#FF9E6D', // Оранжевый
];

export const LEVEL_CONFIGS = [
  { // Уровень 1
    ballSpeed: 7,
    brickRows: 4,
    brickCols: 6,
  },
  { // Уровень 2
    ballSpeed: 8,
    brickRows: 5,
    brickCols: 7,
  },
  { // Уровень 3
    ballSpeed: 9,
    brickRows: 6,
    brickCols: 8,
  },
  { // Уровень 4 и выше
    ballSpeed: 10,
    brickRows: 7,
    brickCols: 9,
  }
];