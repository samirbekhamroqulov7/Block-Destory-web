// Функция интерполяции цвета
export function interpolateColor(color1: string, color2: string, ratio: number): string {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Получение цвета блока в зависимости от слоев
export function getBlockColor(layers: number): string {
  if (layers <= 10) {
    // Красный градиент
    const ratio = (layers - 1) / 9;
    return interpolateColor('#FFB3BA', '#990000', ratio);
  } else if (layers <= 20) {
    // Зеленый градиент
    const ratio = (layers - 11) / 9;
    return interpolateColor('#BAFFB3', '#009900', ratio);
  } else if (layers <= 30) {
    // Синий градиент
    const ratio = (layers - 21) / 9;
    return interpolateColor('#B3D9FF', '#0066CC', ratio);
  } else if (layers <= 40) {
    // Желто-оранжевый градиент
    const ratio = (layers - 31) / 9;
    return interpolateColor('#FFFFB3', '#FF8C00', ratio);
  } else {
    // Фиолетовый градиент
    const ratio = Math.min((layers - 41) / 9, 1);
    return interpolateColor('#E6B3FF', '#6600CC', ratio);
  }
}

// Генерация случайного числа в диапазоне
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max));
}

// Проверка пересечения
export function isColliding(rect1: {x: number, y: number, width: number, height: number}, 
                           rect2: {x: number, y: number, width: number, height: number}): boolean {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}