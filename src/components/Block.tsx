'use client'

import { Block as BlockType } from '@/lib/blockGenerator';
import { useEffect, useState } from 'react';

interface BlockProps {
  block: BlockType;
}

export default function Block({ block }: BlockProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (block.isHit) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [block.isHit]);
  
  // Стили в зависимости от типа блока
  const getBlockStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${block.x}px`,
      top: `${block.y}px`,
      width: `${block.width}px`,
      height: `${block.height}px`,
      borderRadius: '8px',
      backgroundColor: block.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)',
      transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
      transition: 'transform 0.1s ease',
      opacity: block.isDestroyed ? 0 : 1,
      transitionProperty: 'opacity, transform',
      transitionDuration: '0.2s',
    };
    
    // Стили для специальных блоков
    switch (block.type) {
      case 'bomb':
        return {
          ...baseStyle,
          border: '2px solid #000',
          animation: 'bomb-pulse 1s ease-in-out infinite',
        };
      case 'vertical':
        return {
          ...baseStyle,
          border: '2px solid #00BCD4',
          background: `linear-gradient(to bottom, 
            ${block.color}, 
            ${block.color},
            transparent 10%,
            transparent 90%,
            ${block.color})`,
        };
      case 'horizontal':
        return {
          ...baseStyle,
          border: '2px solid #FFC107',
          background: `linear-gradient(to right, 
            ${block.color}, 
            ${block.color},
            transparent 10%,
            transparent 90%,
            ${block.color})`,
        };
      case 'diagonal':
        return {
          ...baseStyle,
          border: '2px solid #9C27B0',
          background: `
            linear-gradient(45deg, transparent 48%, ${block.color} 48%, ${block.color} 52%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, ${block.color} 48%, ${block.color} 52%, transparent 52%),
            ${block.color}
          `,
        };
      default:
        return baseStyle;
    }
  };
  
  // Иконка для специальных блоков
  const getIcon = () => {
    switch (block.type) {
      case 'bomb':
        return <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '24px' }}>💣</span>;
      case 'vertical':
        return <span style={{ position: 'absolute', top: '-8px', fontSize: '20px' }}>↕️</span>;
      case 'horizontal':
        return <span style={{ position: 'absolute', top: '-8px', fontSize: '20px' }}>↔️</span>;
      case 'diagonal':
        return <span style={{ position: 'absolute', top: '-8px', fontSize: '20px' }}>✖️</span>;
      default:
        return null;
    }
  };
  
  if (block.isDestroyed) return null;
  
  return (
    <div style={getBlockStyle()}>
      {block.layers}
      {getIcon()}
    </div>
  );
}