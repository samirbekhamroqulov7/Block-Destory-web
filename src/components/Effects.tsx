'use client'

import { useState, useEffect } from 'react';

interface Effect {
  id: string;
  type: 'explosion' | 'vertical-laser' | 'horizontal-laser' | 'diagonal-laser';
  x: number;
  y: number;
  size: number;
  duration: number;
  color: string;
}

interface EffectsProps {
  effects: Effect[];
}

export default function Effects({ effects }: EffectsProps) {
  const [visibleEffects, setVisibleEffects] = useState<Effect[]>([]);
  
  useEffect(() => {
    setVisibleEffects(effects);
    
    // Удаляем эффекты после их длительности
    effects.forEach(effect => {
      setTimeout(() => {
        setVisibleEffects(prev => prev.filter(e => e.id !== effect.id));
      }, effect.duration);
    });
  }, [effects]);
  
  return (
    <>
      {visibleEffects.map(effect => {
        switch (effect.type) {
          case 'explosion':
            return (
              <div
                key={effect.id}
                style={{
                  position: 'absolute',
                  left: `${effect.x - effect.size / 2}px`,
                  top: `${effect.y - effect.size / 2}px`,
                  width: `${effect.size}px`,
                  height: `${effect.size}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(
                    circle,
                    rgba(255, 107, 0, 0.6),
                    rgba(255, 0, 0, 0.4),
                    transparent
                  )`,
                  animation: 'explosion-expand 0.5s ease-out forwards',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              />
            );
            
          case 'vertical-laser':
            return (
              <div
                key={effect.id}
                style={{
                  position: 'absolute',
                  left: `${effect.x - 2}px`,
                  top: '0',
                  width: '4px',
                  height: '100%',
                  background: `linear-gradient(
                    to bottom,
                    transparent,
                    rgba(0, 255, 255, 0.8),
                    rgba(0, 255, 255, 0.6),
                    transparent
                  )`,
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
                  animation: 'laser-shoot 0.4s ease-out forwards',
                  pointerEvents: 'none',
                  zIndex: 15,
                }}
              />
            );
            
          case 'horizontal-laser':
            return (
              <div
                key={effect.id}
                style={{
                  position: 'absolute',
                  left: '0',
                  top: `${effect.y - 2}px`,
                  width: '100%',
                  height: '4px',
                  background: `linear-gradient(
                    to right,
                    transparent,
                    rgba(255, 215, 0, 0.8),
                    rgba(255, 215, 0, 0.6),
                    transparent
                  )`,
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
                  animation: 'laser-shoot 0.4s ease-out forwards',
                  pointerEvents: 'none',
                  zIndex: 15,
                }}
              />
            );
            
          case 'diagonal-laser':
            return (
              <div
                key={effect.id}
                style={{
                  position: 'absolute',
                  left: `${effect.x}px`,
                  top: `${effect.y}px`,
                  width: '100%',
                  height: '100%',
                  background: `
                    linear-gradient(
                      45deg,
                      transparent 48%,
                      rgba(156, 39, 176, 0.8) 48%,
                      rgba(156, 39, 176, 0.8) 52%,
                      transparent 52%
                    ),
                    linear-gradient(
                      -45deg,
                      transparent 48%,
                      rgba(156, 39, 176, 0.8) 48%,
                      rgba(156, 39, 176, 0.8) 52%,
                      transparent 52%
                  )`,
                  animation: 'laser-shoot 0.5s ease-out forwards',
                  pointerEvents: 'none',
                  zIndex: 15,
                }}
              />
            );
            
          default:
            return null;
        }
      })}
    </>
  );
}