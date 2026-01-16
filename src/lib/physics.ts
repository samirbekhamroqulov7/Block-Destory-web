export interface Ball {
  id: string;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  isActive: boolean;
  isReturned: boolean;
  color: string;
}

export interface AimTrajectoryPoint {
  x: number;
  y: number;
  isBounce: boolean;
  isHit?: boolean;
}

const BALL_RADIUS = 8;
const BALL_SPEED = 400;
const GAME_WIDTH = 7 * 54; // 7 блоков * (50px + 4px gap)
const GAME_HEIGHT = 600;
const START_LINE_Y = 480;

// Расчет траектории прицеливания
export function calculateAimTrajectory(
  startX: number,
  startY: number,
  dirX: number,
  dirY: number,
  blocks: any[],
  maxPoints: number = 100
): AimTrajectoryPoint[] {
  const points: AimTrajectoryPoint[] = [];
  let x = startX;
  let y = startY;
  let vx = dirX * BALL_SPEED;
  let vy = dirY * BALL_SPEED;
  
  for (let i = 0; i < maxPoints; i++) {
    // Шаг симуляции
    const dt = 0.016;
    x += vx * dt;
    y += vy * dt;
    
    // Проверка границ
    if (x <= BALL_RADIUS) {
      x = BALL_RADIUS;
      vx = Math.abs(vx);
      points.push({ x, y, isBounce: true });
    } else if (x >= GAME_WIDTH - BALL_RADIUS) {
      x = GAME_WIDTH - BALL_RADIUS;
      vx = -Math.abs(vx);
      points.push({ x, y, isBounce: true });
    }
    
    if (y <= BALL_RADIUS) {
      y = BALL_RADIUS;
      vy = Math.abs(vy);
      points.push({ x, y, isBounce: true });
    }
    
    // Проверка достижения нижней линии
    if (y >= START_LINE_Y) {
      points.push({ x, y, isBounce: false });
      break;
    }
    
    // Проверка попадания в блок
    let hitBlock = false;
    for (const block of blocks) {
      if (block.isDestroyed) continue;
      
      const dx = x - Math.max(block.x, Math.min(x, block.x + block.width));
      const dy = y - Math.max(block.y, Math.min(y, block.y + block.height));
      
      if (dx * dx + dy * dy < BALL_RADIUS * BALL_RADIUS) {
        // Определяем сторону столкновения
        const overlapX = Math.min(x + BALL_RADIUS - block.x, block.x + block.width - (x - BALL_RADIUS));
        const overlapY = Math.min(y + BALL_RADIUS - block.y, block.y + block.height - (y - BALL_RADIUS));
        
        if (overlapX < overlapY) {
          vx = -vx;
        } else {
          vy = -vy;
        }
        
        points.push({ x, y, isBounce: true, isHit: true });
        hitBlock = true;
        break;
      }
    }
    
    if (!hitBlock) {
      points.push({ x, y, isBounce: false });
    }
  }
  
  return points;
}

// Создание мяча
export function createBall(x: number, y: number, dirX: number, dirY: number): Ball {
  return {
    id: `ball-${Date.now()}-${Math.random()}`,
    x,
    y,
    radius: BALL_RADIUS,
    vx: dirX * BALL_SPEED,
    vy: dirY * BALL_SPEED,
    isActive: true,
    isReturned: false,
    color: '#FFFFFF'
  };
}

// Обновление позиции мяча
export function updateBall(ball: Ball, dt: number): Ball {
  return {
    ...ball,
    x: ball.x + ball.vx * dt,
    y: ball.y + ball.vy * dt
  };
}

// Проверка столкновения со стенами
export function checkWallCollision(ball: Ball): Ball {
  let newBall = { ...ball };
  
  // Левая стена
  if (newBall.x - newBall.radius <= 0) {
    newBall.x = newBall.radius;
    newBall.vx = Math.abs(newBall.vx);
  }
  // Правая стена
  if (newBall.x + newBall.radius >= GAME_WIDTH) {
    newBall.x = GAME_WIDTH - newBall.radius;
    newBall.vx = -Math.abs(newBall.vx);
  }
  // Верхняя стена
  if (newBall.y - newBall.radius <= 0) {
    newBall.y = newBall.radius;
    newBall.vy = Math.abs(newBall.vy);
  }
  // Нижняя граница
  if (newBall.y >= START_LINE_Y) {
    newBall.isReturned = true;
    newBall.isActive = false;
  }
  
  return newBall;
}

// Проверка столкновения с блоком
export function checkBlockCollision(ball: Ball, block: any): { ball: Ball; block: any; hit: boolean } {
  const result = {
    ball: { ...ball },
    block: { ...block },
    hit: false
  };
  
  if (block.isDestroyed) return result;
  
  const dx = ball.x - Math.max(block.x, Math.min(ball.x, block.x + block.width));
  const dy = ball.y - Math.max(block.y, Math.min(ball.y, block.y + block.height));
  
  if (dx * dx + dy * dy < ball.radius * ball.radius) {
    // Определяем сторону столкновения
    const overlapX = Math.min(ball.x + ball.radius - block.x, block.x + block.width - (ball.x - ball.radius));
    const overlapY = Math.min(ball.y + ball.radius - block.y, block.y + block.height - (ball.y - ball.radius));
    
    if (overlapX < overlapY) {
      result.ball.vx = -result.ball.vx;
    } else {
      result.ball.vy = -result.ball.vy;
    }
    
    result.block.layers--;
    result.block.isHit = true;
    result.hit = true;
    
    // Убираем эффект попадания через 200мс
    setTimeout(() => {
      result.block.isHit = false;
    }, 200);
    
    // Проверяем уничтожение
    if (result.block.layers <= 0) {
      result.block.isDestroyed = true;
    }
  }
  
  return result;
}