'use client'

import { AimTrajectoryPoint } from '@/lib/physics';

interface AimLineProps {
  points: AimTrajectoryPoint[];
  startX: number;
  startY: number;
  isVisible: boolean;
}

export default function AimLine({ points, startX, startY, isVisible }: AimLineProps) {
  if (!isVisible || points.length === 0) return null;
  
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Основная линия */}
      <polyline
        points={`${startX},${startY} ${points.map(p => `${p.x},${p.y}`).join(' ')}`}
        fill="none"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="2"
        strokeDasharray="8, 8"
        style={{
          filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))',
          animation: 'dash 0.5s linear infinite',
        }}
      />
      
      {/* Точки отскока */}
      {points
        .filter(p => p.isBounce)
        .map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="rgba(255, 255, 255, 0.9)"
            style={{
              filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))',
            }}
          />
        ))}
    </svg>
  );
}