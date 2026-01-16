import { getBlockColor } from './utils';

export type BlockType = 'normal' | 'bomb' | 'vertical' | 'horizontal' | 'diagonal';

export interface Block {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: BlockType;
  layers: number;
  originalLayers?: number; // Для специальных блоков
  color: string;
  isHit: boolean;
  isDestroyed: boolean;
}

const BLOCK_WIDTH = 50;
const BLOCK_HEIGHT = 50;
const BLOCK_GAP = 4;
const GRID_COLS = 7;

export function generateNewRow(level: number, rowIndex: number): (Block | null)[] {
  const maxLayers = Math.min(level + 2, 50);
  const row: (Block | null)[] = [];
  
  for (let col = 0; col < GRID_COLS; col++) {
    const randomValue = Math.random();
    const x = col * (BLOCK_WIDTH + BLOCK_GAP);
    const y = rowIndex * (BLOCK_HEIGHT + BLOCK_GAP);
    
    if (randomValue < 0.05) {
      // 5% шанс - пустое место
      row.push(null);
    } else if (randomValue < 0.12) {
      // 7% шанс - бомба (3-7 слоев)
      const layers = randomInt(3, 8);
      row.push({
        id: `bomb-${rowIndex}-${col}`,
        row: rowIndex,
        col: col,
        x: x,
        y: y,
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        type: 'bomb',
        layers: layers,
        originalLayers: layers,
        color: getBlockColor(layers),
        isHit: false,
        isDestroyed: false
      });
    } else if (randomValue < 0.17) {
      // 5% шанс - вертикальный (4-9 слоев)
      const layers = randomInt(4, 10);
      row.push({
        id: `vertical-${rowIndex}-${col}`,
        row: rowIndex,
        col: col,
        x: x,
        y: y,
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        type: 'vertical',
        layers: layers,
        originalLayers: layers,
        color: getBlockColor(layers),
        isHit: false,
        isDestroyed: false
      });
    } else if (randomValue < 0.22) {
      // 5% шанс - горизонтальный (4-9 слоев)
      const layers = randomInt(4, 10);
      row.push({
        id: `horizontal-${rowIndex}-${col}`,
        row: rowIndex,
        col: col,
        x: x,
        y: y,
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        type: 'horizontal',
        layers: layers,
        originalLayers: layers,
        color: getBlockColor(layers),
        isHit: false,
        isDestroyed: false
      });
    } else if (randomValue < 0.27) {
      // 5% шанс - диагональный (4-9 слоев)
      const layers = randomInt(4, 10);
      row.push({
        id: `diagonal-${rowIndex}-${col}`,
        row: rowIndex,
        col: col,
        x: x,
        y: y,
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        type: 'diagonal',
        layers: layers,
        originalLayers: layers,
        color: getBlockColor(layers),
        isHit: false,
        isDestroyed: false
      });
    } else {
      // 73% шанс - обычный блок (1-maxLayers слоев)
      const layers = randomInt(1, maxLayers + 1);
      row.push({
        id: `normal-${rowIndex}-${col}`,
        row: rowIndex,
        col: col,
        x: x,
        y: y,
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        type: 'normal',
        layers: layers,
        color: getBlockColor(layers),
        isHit: false,
        isDestroyed: false
      });
    }
  }
  
  return row;
}

export function initLevel(level: number): Block[] {
  const blocks: Block[] = [];
  const initialRows = Math.min(4 + Math.floor(level / 3), 6);
  
  for (let row = 0; row < initialRows; row++) {
    const rowBlocks = generateNewRow(level, row);
    rowBlocks.forEach((block, col) => {
      if (block) {
        blocks.push(block);
      }
    });
  }
  
  return blocks;
}

// Получение всех блоков в радиусе взрыва
export function getBlocksInRadius(blocks: Block[], centerRow: number, centerCol: number, radius: number): Block[] {
  return blocks.filter(block => {
    const rowDist = Math.abs(block.row - centerRow);
    const colDist = Math.abs(block.col - centerCol);
    return rowDist <= radius && colDist <= radius;
  });
}

// Получение всех блоков в столбце
export function getBlocksInColumn(blocks: Block[], col: number): Block[] {
  return blocks.filter(block => block.col === col);
}

// Получение всех блоков в ряду
export function getBlocksInRow(blocks: Block[], row: number): Block[] {
  return blocks.filter(block => block.row === row);
}

// Получение всех блоков на диагоналях
export function getBlocksOnDiagonals(blocks: Block[], centerRow: number, centerCol: number): Block[] {
  return blocks.filter(block => {
    // Главная диагональ
    if ((block.row - centerRow) === (block.col - centerCol)) {
      return true;
    }
    // Побочная диагональ
    if ((block.row - centerRow) === -(block.col - centerCol)) {
      return true;
    }
    return false;
  });
}