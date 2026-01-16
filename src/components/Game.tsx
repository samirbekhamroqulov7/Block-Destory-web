'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Block, initLevel, generateNewRow } from '@/lib/blockGenerator'
import { Ball, createBall, updateBall, checkWallCollision, checkBlockCollision, calculateAimTrajectory, AimTrajectoryPoint } from '@/lib/physics'
import { 
  GameState, 
  calculateScore, 
  activateBombBlock, 
  activateVerticalLaser, 
  activateHorizontalLaser, 
  activateDiagonalLaser, 
  moveBlocksDown, 
  checkGameOver,
  saveRecord,
  loadRecord 
} from '@/lib/gameLogic'
import BlockComponent from './Block'
import BallComponent from './Ball'
import AimLine from './AimLine'
import Effects from './Effects'
import Header from './UI/Header'
import GameOverScreen from './UI/GameOver'

const GAME_WIDTH = 7 * 54; // 7 блоков * (50px + 4px gap)
const GAME_HEIGHT = 600;
const START_LINE_Y = 480;
const LAUNCHER_X = GAME_WIDTH / 2;
const LAUNCHER_Y = START_LINE_Y + 60;

export default function Game() {
  // Состояние игры
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    record: 0,
    ballsCount: 1,
    gameStatus: 'aiming',
    blocks: [],
    balls: [],
    comboCount: 0,
    comboMultiplier: 1,
    lastScoreTime: 0,
  });
  
  const [isAiming, setIsAiming] = useState(false);
  const [aimStart, setAimStart] = useState({ x: 0, y: 0 });
  const [aimCurrent, setAimCurrent] = useState({ x: 0, y: 0 });
  const [trajectoryPoints, setTrajectoryPoints] = useState<AimTrajectoryPoint[]>([]);
  const [effects, setEffects] = useState<any[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  // Загрузка рекорда
  useEffect(() => {
    const record = loadRecord();
    setGameState(prev => ({ ...prev, record }));
  }, []);
  
  // Инициализация игры
  useEffect(() => {
    startNewGame();
  }, []);
  
  const startNewGame = () => {
    const initialBlocks = initLevel(1);
    setGameState({
      level: 1,
      score: 0,
      record: loadRecord(),
      ballsCount: 1,
      gameStatus: 'aiming',
      blocks: initialBlocks,
      balls: [],
      comboCount: 0,
      comboMultiplier: 1,
      lastScoreTime: 0,
    });
    setIsPaused(false);
    setShowGameOver(false);
    setIsNewRecord(false);
  };
  
  // Обработка ввода
  const handleAimStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState.gameStatus !== 'aiming' || isPaused) return;
    
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Проверяем, что клик рядом с пусковой платформой
    const distance = Math.sqrt((x - LAUNCHER_X) ** 2 + (y - LAUNCHER_Y) ** 2);
    if (distance > 50) return;
    
    setIsAiming(true);
    setAimStart({ x, y });
    setAimCurrent({ x, y });
  };
  
  const handleAimMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isAiming || isPaused) return;
    
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Ограничиваем минимальную дистанцию
    const dx = x - LAUNCHER_X;
    const dy = y - LAUNCHER_Y;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    if (len < 20) {
      setAimCurrent({ x: LAUNCHER_X, y: LAUNCHER_Y - 20 });
    } else {
      setAimCurrent({ x, y });
    }
    
    // Рассчитываем направление
    const dirX = (x - LAUNCHER_X) / Math.max(len, 1);
    const dirY = (y - LAUNCHER_Y) / Math.max(len, 1);
    
    // Ограничиваем угол (нельзя стрелять вниз)
    let adjustedDirY = dirY;
    if (dirY > -0.1) {
      adjustedDirY = -0.1;
      const ratio = Math.sqrt(1 - adjustedDirY * adjustedDirY);
      const adjustedDirX = dirX > 0 ? ratio : -ratio;
      
      // Пересчитываем траекторию
      const points = calculateAimTrajectory(
        LAUNCHER_X,
        LAUNCHER_Y,
        adjustedDirX,
        adjustedDirY,
        gameState.blocks
      );
      setTrajectoryPoints(points);
    } else {
      // Рассчитываем траекторию
      const points = calculateAimTrajectory(
        LAUNCHER_X,
        LAUNCHER_Y,
        dirX,
        dirY,
        gameState.blocks
      );
      setTrajectoryPoints(points);
    }
  };
  
  const handleAimEnd = () => {
    if (!isAiming || isPaused) return;
    
    setIsAiming(false);
    
    // Проверяем минимальную дистанцию перетаскивания
    const dx = aimCurrent.x - aimStart.x;
    const dy = aimCurrent.y - aimStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 20) return;
    
    // Рассчитываем направление выстрела
    const dirX = (aimCurrent.x - LAUNCHER_X) / Math.max(dist, 1);
    const dirY = (aimCurrent.y - LAUNCHER_Y) / Math.max(dist, 1);
    
    // Запускаем мячи
    shootBalls(dirX, Math.max(dirY, -0.9));
    setTrajectoryPoints([]);
  };
  
  const shootBalls = (dirX: number, dirY: number) => {
    setGameState(prev => ({ ...prev, gameStatus: 'shooting' }));
    
    const newBalls: Ball[] = [];
    const ballDelay = 150; // 0.15 секунды между мячами
    
    for (let i = 0; i < gameState.ballsCount; i++) {
      setTimeout(() => {
        const ball = createBall(LAUNCHER_X, LAUNCHER_Y, dirX, dirY);
        setGameState(prev => ({
          ...prev,
          balls: [...prev.balls, ball]
        }));
      }, i * ballDelay);
    }
  };
  
  // Игровой цикл
  const gameLoop = useCallback((currentTime: number) => {
    if (isPaused || gameState.gameStatus !== 'shooting') {
      lastTimeRef.current = currentTime;
      animationRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;
    
    setGameState(prev => {
      let newState = { ...prev };
      let comboIncrement = false;
      
      // Обновляем позиции мячей
      newState.balls = newState.balls.map(ball => {
        if (!ball.isActive) return ball;
        
        let updatedBall = updateBall(ball, deltaTime);
        updatedBall = checkWallCollision(updatedBall);
        
        // Проверяем столкновения с блоками
        newState.blocks = newState.blocks.map(block => {
          if (block.isDestroyed) return block;
          
          const collision = checkBlockCollision(updatedBall, block);
          if (collision.hit) {
            updatedBall = collision.ball;
            comboIncrement = true;
            
            // Если блок уничтожен
            if (collision.block.isDestroyed) {
              // Подсчитываем очки
              const scoreToAdd = calculateScore(
                collision.block,
                newState.comboCount,
                newState.comboMultiplier
              );
              newState.score += scoreToAdd;
              
              // Проверяем специальные блоки
              switch (collision.block.type) {
                case 'bomb':
                  const bombResult = activateBombBlock(collision.block, newState.blocks);
                  newState.blocks = bombResult.updatedBlocks;
                  
                  // Добавляем эффект взрыва
                  setEffects(prev => [...prev, {
                    id: `explosion-${Date.now()}`,
                    type: 'explosion',
                    x: collision.block.x + collision.block.width / 2,
                    y: collision.block.y + collision.block.height / 2,
                    size: 250,
                    duration: 500,
                    color: '#FF6B00'
                  }]);
                  break;
                  
                case 'vertical':
                  const verticalResult = activateVerticalLaser(collision.block, newState.blocks);
                  newState.blocks = verticalResult.updatedBlocks;
                  
                  setEffects(prev => [...prev, {
                    id: `vertical-${Date.now()}`,
                    type: 'vertical-laser',
                    x: collision.block.x + collision.block.width / 2,
                    y: 0,
                    size: 0,
                    duration: 400,
                    color: '#00BCD4'
                  }]);
                  break;
                  
                case 'horizontal':
                  const horizontalResult = activateHorizontalLaser(collision.block, newState.blocks);
                  newState.blocks = horizontalResult.updatedBlocks;
                  
                  setEffects(prev => [...prev, {
                    id: `horizontal-${Date.now()}`,
                    type: 'horizontal-laser',
                    x: 0,
                    y: collision.block.y + collision.block.height / 2,
                    size: 0,
                    duration: 400,
                    color: '#FFC107'
                  }]);
                  break;
                  
                case 'diagonal':
                  const diagonalResult = activateDiagonalLaser(collision.block, newState.blocks);
                  newState.blocks = diagonalResult.updatedBlocks;
                  
                  setEffects(prev => [...prev, {
                    id: `diagonal-${Date.now()}`,
                    type: 'diagonal-laser',
                    x: collision.block.x + collision.block.width / 2,
                    y: collision.block.y + collision.block.height / 2,
                    size: 0,
                    duration: 500,
                    color: '#9C27B0'
                  }]);
                  break;
              }
            }
            
            return collision.block;
          }
          
          return block;
        });
        
        return updatedBall;
      });
      
      // Увеличиваем комбо
      if (comboIncrement) {
        const now = Date.now();
        if (now - newState.lastScoreTime < 2000) {
          newState.comboCount++;
          newState.comboMultiplier = Math.min(newState.comboMultiplier + 0.1, 3);
        } else {
          newState.comboCount = 1;
          newState.comboMultiplier = 1;
        }
        newState.lastScoreTime = now;
      }
      
      // Проверяем, все ли мячи вернулись
      const activeBalls = newState.balls.filter(ball => ball.isActive);
      if (activeBalls.length === 0 && newState.balls.length > 0) {
        // Все мячи вернулись
        newState.gameStatus = 'movingBlocks';
        
        // Опускаем блоки
        newState.blocks = moveBlocksDown(newState.blocks.filter(b => !b.isDestroyed));
        
        // Добавляем новый ряд
        const newRow = generateNewRow(newState.level, 0);
        newRow.forEach((block, col) => {
          if (block) {
            newState.blocks.push(block);
          }
        });
        
        // Проверяем поражение
        if (checkGameOver(newState.blocks)) {
          newState.gameStatus = 'gameOver';
          const newRecord = saveRecord(newState.score);
          setIsNewRecord(newRecord);
          setShowGameOver(true);
        } else {
          // Увеличиваем уровень и количество мячей
          newState.level++;
          newState.ballsCount = Math.min(newState.level, 5); // Максимум 5 мячей
          newState.gameStatus = 'aiming';
        }
        
        newState.balls = [];
        newState.comboCount = 0;
        newState.comboMultiplier = 1;
      }
      
      return newState;
    });
    
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPaused, gameState.gameStatus]);
  
  // Запуск игрового цикла
  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);
  
  // Фильтруем уничтоженные блоки
  const activeBlocks = gameState.blocks.filter(block => !block.isDestroyed);
  
  return (
    <div style={{ 
      width: '100%', 
      maxWidth: `${GAME_WIDTH}px`, 
      margin: '0 auto',
      position: 'relative',
    }}>
      <Header
        record={gameState.record}
        score={gameState.score}
        level={gameState.level}
        ballsCount={gameState.ballsCount}
        onMenuClick={() => setIsPaused(!isPaused)}
      />
      
      <div
        ref={canvasRef}
        style={{
          position: 'relative',
          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
          background: 'linear-gradient(to bottom, #E8F4F8 0%, #C8E3F0 100%)',
          overflow: 'hidden',
          cursor: isAiming ? 'crosshair' : 'default',
          touchAction: 'none',
        }}
        onMouseDown={handleAimStart}
        onMouseMove={handleAimMove}
        onMouseUp={handleAimEnd}
        onMouseLeave={handleAimEnd}
        onTouchStart={handleAimStart}
        onTouchMove={handleAimMove}
        onTouchEnd={handleAimEnd}
      >
        {/* Блоки */}
        {activeBlocks.map(block => (
          <BlockComponent key={block.id} block={block} />
        ))}
        
        {/* Мячи */}
        {gameState.balls.map(ball => (
          <BallComponent key={ball.id} ball={ball} />
        ))}
        
        {/* Линия прицеливания */}
        <AimLine
          points={trajectoryPoints}
          startX={LAUNCHER_X}
          startY={LAUNCHER_Y}
          isVisible={isAiming}
        />
        
        {/* Эффекты */}
        <Effects effects={effects} />
        
        {/* Линия старта */}
        <div
          style={{
            position: 'absolute',
            bottom: `${START_LINE_Y}px`,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(to right, transparent 0%, #FF3D3D 20%, #FF3D3D 80%, transparent 100%)',
            boxShadow: '0 0 10px rgba(255, 61, 61, 0.5)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        
        {/* Пусковая платформа */}
        <div
          style={{
            position: 'absolute',
            left: `${LAUNCHER_X - 40}px`,
            top: `${LAUNCHER_Y - 40}px`,
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, #FFFFFF, #E0E0E0)',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#5DADE2',
          }}
          data-balls={gameState.ballsCount}
        >
          {gameState.ballsCount}
        </div>
      </div>
      
      {/* Экран паузы */}
      {isPaused && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            background: 'linear-gradient(to bottom, #2C3E50, #34495E)',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            minWidth: '300px',
          }}>
            <h2 style={{ fontSize: '36px', color: '#FFFFFF', marginBottom: '30px' }}>PAUSED</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button
                onClick={() => setIsPaused(false)}
                style={{
                  background: 'linear-gradient(to bottom, #3498DB, #2980B9)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                Resume
              </button>
              <button
                onClick={startNewGame}
                style={{
                  background: 'linear-gradient(to bottom, #E74C3C, #C0392B)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Экран Game Over */}
      {showGameOver && (
        <GameOverScreen
          score={gameState.score}
          record={Math.max(gameState.score, gameState.record)}
          isNewRecord={isNewRecord}
          onRetry={startNewGame}
          onMenu={() => {
            setShowGameOver(false);
            setIsPaused(true);
          }}
        />
      )}
    </div>
  );
}