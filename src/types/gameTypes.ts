export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Brick {
  id: string;
  position: Position;
  size: Size;
  color: string;
  health: number;
  points: number;
}

export interface GameState {
  score: number;
  lives: number;
  level: number;
  isPaused: boolean;
  isGameOver: boolean;
  isGameStarted: boolean;
}

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
  platform: 'ios' | 'android';
  aspectRatio: number;
}

export interface GameConfig {
  ballSpeed: number;
  paddleSpeed: number;
  brickRows: number;
  brickCols: number;
  initialLives: number;
  brickHealth: number;
}