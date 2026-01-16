import React from 'react';
import { Brick as BrickType } from '../types/gameTypes';

interface BrickProps {
  brick: BrickType;
}

const Brick: React.FC<BrickProps> = ({ brick }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${brick.position.x}px`,
        top: `${brick.position.y}px`,
        width: `${brick.size.width}px`,
        height: `${brick.size.height}px`,
        backgroundColor: brick.color,
        opacity: brick.health > 0 ? 1 : 0,
        borderRadius: '4px',
        border: '1px solid #fff',
      }}
    />
  );
};

export default Brick;