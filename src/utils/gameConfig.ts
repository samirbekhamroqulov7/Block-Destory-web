import { GameConfig, DeviceInfo } from '../types/gameTypes';

export const GAME_CONSTANTS = {
  BALL_SIZE: 20,
  PADDLE_HEIGHT: 20,
  PADDLE_WIDTH_RATIO: 0.25,
  BRICK_HEIGHT: 30,
  BRICK_MARGIN: 2,
};

export const getGameConfig = (deviceInfo: DeviceInfo): GameConfig => {
  const { isTablet } = deviceInfo;

  return {
    ballSpeed: isTablet ? 7 : 8,
    paddleSpeed: isTablet ? 12 : 15,
    brickRows: isTablet ? 5 : 4,
    brickCols: isTablet ? 7 : 6,
    initialLives: 3,
    brickHealth: 1,
  };
};

export const BRICK_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFD166',
  '#06D6A0',
  '#118AB2',
  '#EF476F',
  '#8338EC',
  '#FF9E6D',
];

export const LEVEL_CONFIGS = [
  {
    ballSpeed: 7,
    brickRows: 4,
    brickCols: 6,
  },
  {
    ballSpeed: 8,
    brickRows: 5,
    brickCols: 7,
  },
  {
    ballSpeed: 9,
    brickRows: 6,
    brickCols: 8,
  },
  {
    ballSpeed: 10,
    brickRows: 7,
    brickCols: 9,
  },
];