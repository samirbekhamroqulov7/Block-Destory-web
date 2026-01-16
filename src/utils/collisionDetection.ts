import { Position, Size } from '../types/gameTypes';

export const checkCollision = (
  ballPos: Position,
  ballSize: number,
  rectPos: Position,
  rectSize: Size
): boolean => {
  const ballRadius = ballSize / 2;
  
  // Определение ближайшей точки прямоугольника к шару
  const closestX = Math.max(
    rectPos.x,
    Math.min(ballPos.x, rectPos.x + rectSize.width)
  );
  const closestY = Math.max(
    rectPos.y,
    Math.min(ballPos.y, rectPos.y + rectSize.height)
  );
  
  // Расстояние от ближайшей точки до центра шара
  const distanceX = ballPos.x - closestX;
  const distanceY = ballPos.y - closestY;
  
  // Проверка пересечения
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  return distanceSquared < (ballRadius * ballRadius);
};

export const checkCircleCollision = (
  pos1: Position,
  radius1: number,
  pos2: Position,
  radius2: number
): boolean => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < radius1 + radius2;
};

export const checkWallCollision = (
  ballPos: Position,
  ballSize: number,
  wallBounds: { left: number; right: number; top: number; bottom: number }
): { horizontal: boolean; vertical: boolean } => {
  const ballRadius = ballSize / 2;
  
  return {
    horizontal: ballPos.x - ballRadius <= wallBounds.left || 
                ballPos.x + ballRadius >= wallBounds.right,
    vertical: ballPos.y - ballRadius <= wallBounds.top || 
              ballPos.y + ballRadius >= wallBounds.bottom,
  };
};

export const getCollisionNormal = (
  ballPos: Position,
  ballSize: number,
  rectPos: Position,
  rectSize: Size
): { x: number; y: number } => {
  const ballRadius = ballSize / 2;
  
  // Вычисление вектора от центра шара к центру прямоугольника
  const rectCenter = {
    x: rectPos.x + rectSize.width / 2,
    y: rectPos.y + rectSize.height / 2,
  };
  
  let normalX = 0;
  let normalY = 0;
  
  // Определение, с какой стороны произошло столкновение
  if (ballPos.y < rectPos.y) {
    // Сверху
    normalY = -1;
  } else if (ballPos.y > rectPos.y + rectSize.height) {
    // Снизу
    normalY = 1;
  }
  
  if (ballPos.x < rectPos.x) {
    // Слева
    normalX = -1;
  } else if (ballPos.x > rectPos.x + rectSize.width) {
    // Справа
    normalX = 1;
  }
  
  // Если столкновение по углу, нормализуем вектор
  if (normalX !== 0 && normalY !== 0) {
    const length = Math.sqrt(normalX * normalX + normalY * normalY);
    normalX /= length;
    normalY /= length;
  }
  
  return { x: normalX, y: normalY };
};