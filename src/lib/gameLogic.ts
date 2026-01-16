import { Block, getBlocksInRadius, getBlocksInColumn, getBlocksInRow, getBlocksOnDiagonals } from './blockGenerator';

export interface GameState {
  level: number;
  score: number;
  record: number;
  ballsCount: number;
  gameStatus: 'aiming' | 'shooting' | 'movingBlocks' | 'gameOver' | 'paused';
  blocks: Block[];
  balls: any[];
  comboCount: number;
  comboMultiplier: number;
  lastScoreTime: number;
}

// Подсчет очков за уничтожение блоков
export function calculateScore(
  block: Block,
  comboCount: number,
  comboMultiplier: number
): number {
  let score = 0;
  
  // Базовые очки за уничтожение блока
  switch (block.type) {
    case 'normal':
      score = block.layers;
      break;
    case 'bomb':
      score = (block.originalLayers || block.layers) * 3;
      break;
    case 'vertical':
    case 'horizontal':
      score = (block.originalLayers || block.layers) * 5;
      break;
    case 'diagonal':
      score = (block.originalLayers || block.layers) * 7;
      break;
  }
  
  // Бонус за комбо
  if (comboCount > 2) {
    score += comboCount * 10 * comboMultiplier;
  }
  
  return score;
}

// Активация бомбы-блока
export function activateBombBlock(
  block: Block,
  allBlocks: Block[]
): { updatedBlocks: Block[]; affectedBlocks: Block[] } {
  const updatedBlocks = [...allBlocks];
  const affectedBlocks: Block[] = [];
  
  if (!block.originalLayers) return { updatedBlocks, affectedBlocks };
  
  // Получаем блоки в радиусе 2
  const nearbyBlocks = getBlocksInRadius(allBlocks, block.row, block.col, 2);
  
  // Применяем урон к каждому блоку
  nearbyBlocks.forEach(nearbyBlock => {
    const index = updatedBlocks.findIndex(b => b.id === nearbyBlock.id);
    if (index !== -1) {
      // Уменьшаем слои на originalLayers бомбы
      updatedBlocks[index].layers -= block.originalLayers!;
      
      // Отмечаем как попадание для анимации
      updatedBlocks[index].isHit = true;
      
      // Проверяем уничтожение
      if (updatedBlocks[index].layers <= 0) {
        updatedBlocks[index].isDestroyed = true;
        affectedBlocks.push(updatedBlocks[index]);
        
        // Если это бомба, активируем цепную реакцию
        if (updatedBlocks[index].type === 'bomb') {
          const result = activateBombBlock(updatedBlocks[index], updatedBlocks);
          updatedBlocks.splice(0, updatedBlocks.length, ...result.updatedBlocks);
          affectedBlocks.push(...result.affectedBlocks);
        }
      }
      
      // Убираем эффект попадания
      setTimeout(() => {
        updatedBlocks[index].isHit = false;
      }, 200);
    }
  });
  
  return { updatedBlocks, affectedBlocks };
}

// Активация вертикального лазера
export function activateVerticalLaser(
  block: Block,
  allBlocks: Block[]
): { updatedBlocks: Block[]; affectedBlocks: Block[] } {
  const updatedBlocks = [...allBlocks];
  const affectedBlocks: Block[] = [];
  
  if (!block.originalLayers) return { updatedBlocks, affectedBlocks };
  
  // Получаем все блоки в столбце
  const columnBlocks = getBlocksInColumn(allBlocks, block.col);
  
  // Применяем урон к каждому блоку в столбце
  columnBlocks.forEach(colBlock => {
    const index = updatedBlocks.findIndex(b => b.id === colBlock.id);
    if (index !== -1) {
      updatedBlocks[index].layers -= block.originalLayers!;
      updatedBlocks[index].isHit = true;
      
      if (updatedBlocks[index].layers <= 0) {
        updatedBlocks[index].isDestroyed = true;
        affectedBlocks.push(updatedBlocks[index]);
        
        // Проверяем специальные блоки для цепной реакции
        if (updatedBlocks[index].type === 'bomb') {
          const result = activateBombBlock(updatedBlocks[index], updatedBlocks);
          updatedBlocks.splice(0, updatedBlocks.length, ...result.updatedBlocks);
          affectedBlocks.push(...result.affectedBlocks);
        }
      }
      
      setTimeout(() => {
        updatedBlocks[index].isHit = false;
      }, 200);
    }
  });
  
  return { updatedBlocks, affectedBlocks };
}

// Активация горизонтального лазера
export function activateHorizontalLaser(
  block: Block,
  allBlocks: Block[]
): { updatedBlocks: Block[]; affectedBlocks: Block[] } {
  const updatedBlocks = [...allBlocks];
  const affectedBlocks: Block[] = [];
  
  if (!block.originalLayers) return { updatedBlocks, affectedBlocks };
  
  // Получаем все блоки в ряду
  const rowBlocks = getBlocksInRow(allBlocks, block.row);
  
  // Применяем урон к каждому блоку в ряду
  rowBlocks.forEach(rowBlock => {
    const index = updatedBlocks.findIndex(b => b.id === rowBlock.id);
    if (index !== -1) {
      updatedBlocks[index].layers -= block.originalLayers!;
      updatedBlocks[index].isHit = true;
      
      if (updatedBlocks[index].layers <= 0) {
        updatedBlocks[index].isDestroyed = true;
        affectedBlocks.push(updatedBlocks[index]);
        
        // Проверяем специальные блоки для цепной реакции
        if (updatedBlocks[index].type === 'bomb') {
          const result = activateBombBlock(updatedBlocks[index], updatedBlocks);
          updatedBlocks.splice(0, updatedBlocks.length, ...result.updatedBlocks);
          affectedBlocks.push(...result.affectedBlocks);
        }
      }
      
      setTimeout(() => {
        updatedBlocks[index].isHit = false;
      }, 200);
    }
  });
  
  return { updatedBlocks, affectedBlocks };
}

// Активация диагонального лазера
export function activateDiagonalLaser(
  block: Block,
  allBlocks: Block[]
): { updatedBlocks: Block[]; affectedBlocks: Block[] } {
  const updatedBlocks = [...allBlocks];
  const affectedBlocks: Block[] = [];
  
  if (!block.originalLayers) return { updatedBlocks, affectedBlocks };
  
  // Получаем все блоки на диагоналях
  const diagonalBlocks = getBlocksOnDiagonals(allBlocks, block.row, block.col);
  
  // Применяем урон к каждому блоку на диагоналях
  diagonalBlocks.forEach(diagBlock => {
    const index = updatedBlocks.findIndex(b => b.id === diagBlock.id);
    if (index !== -1) {
      updatedBlocks[index].layers -= block.originalLayers!;
      updatedBlocks[index].isHit = true;
      
      if (updatedBlocks[index].layers <= 0) {
        updatedBlocks[index].isDestroyed = true;
        affectedBlocks.push(updatedBlocks[index]);
        
        // Проверяем специальные блоки для цепной реакции
        if (updatedBlocks[index].type === 'bomb') {
          const result = activateBombBlock(updatedBlocks[index], updatedBlocks);
          updatedBlocks.splice(0, updatedBlocks.length, ...result.updatedBlocks);
          affectedBlocks.push(...result.affectedBlocks);
        }
      }
      
      setTimeout(() => {
        updatedBlocks[index].isHit = false;
      }, 200);
    }
  });
  
  return { updatedBlocks, affectedBlocks };
}

// Опускание всех блоков на 1 ряд
export function moveBlocksDown(blocks: Block[]): Block[] {
  return blocks.map(block => ({
    ...block,
    row: block.row + 1,
    y: block.y + 54 // 50px высота + 4px gap
  }));
}

// Проверка условия проигрыша
export function checkGameOver(blocks: Block[]): boolean {
  const GAME_OVER_ROW = 10; // Когда блоки достигают этой строки - игра окончена
  return blocks.some(block => block.row >= GAME_OVER_ROW && !block.isDestroyed);
}

// Сохранение рекорда
export function saveRecord(score: number): boolean {
  if (typeof window === 'undefined') return false;
  
  const saved = localStorage.getItem('blockDestroyRecord');
  if (!saved || score > parseInt(saved)) {
    localStorage.setItem('blockDestroyRecord', score.toString());
    return true;
  }
  return false;
}

// Загрузка рекорда
export function loadRecord(): number {
  if (typeof window === 'undefined') return 0;
  
  const saved = localStorage.getItem('blockDestroyRecord');
  return saved ? parseInt(saved) : 0;
}