// src/components/GameCanvas.tsx
'use client';

import React, { useRef, useEffect } from 'react';

interface GameCanvasProps {
  width: number;
  height: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ваша игровая логика на Canvas API
    // Вместо React Native компонентов используйте Canvas

  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        background: '#0F3460',
        borderRadius: '15px',
        border: '2px solid #4ECDC4',
      }}
    />
  );
};

export default GameCanvas;