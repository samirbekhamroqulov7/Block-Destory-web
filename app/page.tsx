'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import GameBoard from '../src/components/GameBoard';
import GameUI from '../src/components/GameUI';
import Ball from '../src/components/Ball';
import Brick from '../src/components/Brick';
import { useDeviceDetection } from '../src/hooks/useDeviceDetection';
import { useGameLogic } from '../src/hooks/useGameLogic';

export default function Home() {
  const deviceInfo = useDeviceDetection();
  const gameRef = useRef<HTMLDivElement>(null);
  const [gameActive, setGameActive] = useState(false);

  const {
    gameState,
    ballPosition,
    paddlePosition,
    bricks,
    startGame,
    pauseGame,
    resetGame,
    movePaddle,
  } = useGameLogic(deviceInfo);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!gameRef.current || !gameActive) return;
    
    const rect = gameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    movePaddle(x, rect.width);
  }, [gameActive, movePaddle]);

  useEffect(() => {
    if (gameActive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameActive, handleMouseMove]);

  return (
    <div ref={gameRef}>
      <GameBoard deviceInfo={deviceInfo}>
        {/* Кирпичи */}
        {bricks.map(brick => (
          <Brick key={brick.id} brick={brick} />
        ))}
        
        {/* Мяч */}
        <Ball position={ballPosition} size={20} />
        
        {/* Платформа */}
        <div
          style={{
            position: 'absolute',
            left: `${paddlePosition.x - 75}px`,
            top: `${paddlePosition.y - 10}px`,
            width: '150px',
            height: '20px',
            backgroundColor: '#4ECDC4',
            borderRadius: '10px',
            border: '2px solid #fff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
          }}
        />
      </GameBoard>
      
      <GameUI
        gameState={gameState}
        onStart={() => {
          startGame();
          setGameActive(true);
        }}
        onPause={() => {
          pauseGame();
          setGameActive(!gameState.isPaused);
        }}
        onReset={() => {
          resetGame(window.innerWidth, window.innerHeight);
          setGameActive(false);
        }}
        onExit={() => window.history.back()}
        deviceInfo={deviceInfo}
      />
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '14px',
      }}>
        {deviceInfo.isTablet 
          ? 'Используйте мышь для управления' 
          : 'Двигайте мышью для управления платформой'
        }
      </div>
    </div>
  );
}