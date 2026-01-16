import React from 'react';
import { Position } from '../types/gameTypes';

interface BallProps {
  position: Position;
  size: number;
}

const Ball: React.FC<BallProps> = ({ position, size }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x - size / 2}px`,
        top: `${position.y - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#FF6B6B',
        borderRadius: '50%',
        boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
      }}
    />
  );
};

export default Ball;