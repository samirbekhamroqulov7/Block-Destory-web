'use client'

import { Ball as BallType } from '@/lib/physics';

interface BallProps {
  ball: BallType;
}

export default function Ball({ ball }: BallProps) {
  if (!ball.isActive) return null;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: `${ball.x - ball.radius}px`,
        top: `${ball.y - ball.radius}px`,
        width: `${ball.radius * 2}px`,
        height: `${ball.radius * 2}px`,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #FFFFFF, #E8F4F8)',
        boxShadow: `
          0 2px 6px rgba(0, 0, 0, 0.3),
          inset -2px -2px 4px rgba(0, 0, 0, 0.1),
          0 0 10px rgba(255, 255, 255, 0.5)
        `,
        pointerEvents: 'none',
      }}
    >
      {/* Эффект следа */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent)',
          borderRadius: '50%',
          transform: 'scale(1.5)',
          opacity: 0.3,
        }}
      />
    </div>
  );
}