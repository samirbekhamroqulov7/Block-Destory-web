'use client';

import React, { useEffect, useRef, useState } from 'react';
import GameBoard from '../src/components/GameBoard';
import GameUI from '../src/components/GameUI';
import Ball from '../src/components/Ball';
import Brick from '../src/components/Brick';
import { useDeviceDetection } from '../src/hooks/useDeviceDetection';
import { useGameLogic } from '../src/hooks/useGameLogic';

export default function Home() {
  const deviceInfo = useDeviceDetection();
  const gameContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameContainerRef.current || !gameState.isGameStarted || gameState.isPaused) return;
      
      const rect = gameContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      movePaddle(x, rect.width);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameState.isGameStarted, gameState.isPaused, movePaddle]);

  const handleExit = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div ref={gameContainerRef}>
      <GameBoard deviceInfo={deviceInfo}>
        {bricks.map(brick => (
          <Brick key={brick.id} brick={brick} />
        ))}
        
        <Ball position={ballPosition} size={deviceInfo.isTablet ? 24 : 20} />
        
        <div
          style={{
            position: 'absolute',
            left: `${paddlePosition.x - (deviceInfo.isTablet ? 100 : 75)}px`,
            top: `${paddlePosition.y - (deviceInfo.isTablet ? 12 : 10)}px`,
            width: `${deviceInfo.isTablet ? 200 : 150}px`,
            height: `${deviceInfo.isTablet ? 25 : 20}px`,
            backgroundColor: '#4ECDC4',
            borderRadius: '10px',
            border: '2px solid #fff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
            transition: 'left 0.1s ease-out',
          }}
        />
      </GameBoard>
      
      <GameUI
        gameState={gameState}
        onStart={startGame}
        onPause={pauseGame}
        onReset={resetGame}
        onExit={handleExit}
        deviceInfo={deviceInfo}
      />
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.7)',
        fontSize: deviceInfo.isTablet ? '16px' : '14px',
        padding: '10px',
      }}>
        Двигайте мышью для управления платформой
      </div>
    </div>
  );
}