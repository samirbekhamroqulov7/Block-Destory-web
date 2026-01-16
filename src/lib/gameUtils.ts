// Константы игры
export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600

export const BALL_SIZE = 12
export const BALL_SPEED = 8
export const MAX_BALLS = 5

export const PADDLE_WIDTH = 100
export const PADDLE_HEIGHT = 20

export const BRICK_WIDTH = 70
export const BRICK_HEIGHT = 25
export const BRICK_ROWS = 6
export const BRICK_COLUMNS = 9
export const BRICK_HP = 2 // У кирпичей теперь HP

export const POWERUP_SIZE = 15
export const POWERUP_SPEED = 3

// Типы
export interface Brick {
  x: number
  y: number
  width: number
  height: number
  hp: number
  maxHp: number
  color: string
}

export interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
  active: boolean
}

export interface PowerUp {
  x: number
  y: number
  type: 'extra_ball' | 'paddle_size' | 'ball_speed'
  active: boolean
}

export interface Trajectory {
  startX: number
  startY: number
  endX: number
  endY: number
  visible: boolean
}

// Цвета для разных уровней HP кирпичей
export const getBrickColor = (hp: number, maxHp: number): string => {
  const percent = hp / maxHp
  if (percent > 0.75) return '#ef4444' // Красный
  if (percent > 0.5) return '#f97316' // Оранжевый
  if (percent > 0.25) return '#eab308' // Желтый
  return '#22c55e' // Зеленый
}

// Генерация случайного кирпича с HP
export const createBrick = (x: number, y: number): Brick => ({
  x,
  y,
  width: BRICK_WIDTH,
  height: BRICK_HEIGHT,
  hp: BRICK_HP,
  maxHp: BRICK_HP,
  color: getBrickColor(BRICK_HP, BRICK_HP)
})

// Создание траектории
export const calculateTrajectory = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
): { dx: number; dy: number } => {
  const angle = Math.atan2(endY - startY, endX - startX)
  return {
    dx: Math.cos(angle) * BALL_SPEED,
    dy: Math.sin(angle) * BALL_SPEED
  }
}