import { useState, useCallback, useEffect } from 'react';
import { GameState, Brick, Position, Size, DeviceInfo } from '../types/gameTypes';
import { getGameConfig, GAME_CONSTANTS, BRICK_COLORS } from '../utils/gameConfig';
import { checkCollision } from '../utils/collisionDetection';

export const useGameLogic = (deviceInfo: DeviceInfo) => {
  const config = getGameConfig(deviceInfo);
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: config.initialLives,
    level: 1,
    isPaused: false,
    isGameOver: false,
    isGameStarted: false,
  });

  const [ballPosition, setBallPosition] = useState<Position>({ x: 0, y: 0 });
  const [ballVelocity, setBallVelocity] = useState<Position>({ x: 0, y: 0 });
  const [paddlePosition, setPaddlePosition] = useState<Position>({ x: 0, y: 0 });
  const [bricks, setBricks] = useState<Brick[]>([]);

  const initializeGame = useCallback((screenWidth: number, screenHeight: number) => {
    // Инициализация платформы
    const paddleWidth = screenWidth * GAME_CONSTANTS.PADDLE_WIDTH_RATIO;
    const paddleHeight = GAME_CONSTANTS.PADDLE_HEIGHT;
    
    setPaddlePosition({
      x: screenWidth / 2,
      y: screenHeight - 100,
    });

    // Инициализация мяча
    setBallPosition({
      x: screenWidth / 2,
      y: screenHeight - 120,
    });

    // Инициализация кирпичей
    const brickWidth = (screenWidth - (config.brickCols + 1) * GAME_CONSTANTS.BRICK_MARGIN) / config.brickCols;
    const newBricks: Brick[] = [];
    
    for (let row = 0; row < config.brickRows; row++) {
      for (let col = 0; col < config.brickCols; col++) {
        const brickX = col * (brickWidth + GAME_CONSTANTS.BRICK_MARGIN) + GAME_CONSTANTS.BRICK_MARGIN;
        const brickY = row * (GAME_CONSTANTS.BRICK_HEIGHT + GAME_CONSTANTS.BRICK_MARGIN) + 50;
        
        newBricks.push({
          id: `${row}-${col}`,
          position: { x: brickX, y: brickY },
          size: { width: brickWidth, height: GAME_CONSTANTS.BRICK_HEIGHT },
          color: BRICK_COLORS[row % BRICK_COLORS.length],
          health: 1,
          points: (config.brickRows - row) * 10,
        });
      }
    }
    
    setBricks(newBricks);
    setBallVelocity({ x: config.ballSpeed, y: -config.ballSpeed });
  }, [config]);

  const updateGame = useCallback((screenWidth: number, screenHeight: number) => {
    if (gameState.isPaused || gameState.isGameOver || !gameState.isGameStarted) {
      return;
    }

    // Обновление позиции мяча
    let newX = ballPosition.x + ballVelocity.x;
    let newY = ballPosition.y + ballVelocity.y;
    let newVx = ballVelocity.x;
    let newVy = ballVelocity.y;

    // Столкновение со стенами
    if (newX <= GAME_CONSTANTS.BALL_SIZE / 2 || 
        newX >= screenWidth - GAME_CONSTANTS.BALL_SIZE / 2) {
      newVx = -ballVelocity.x;
    }
    
    if (newY <= GAME_CONSTANTS.BALL_SIZE / 2) {
      newVy = -ballVelocity.y;
    }

    // Столкновение с платформой
    const paddleSize: Size = {
      width: screenWidth * GAME_CONSTANTS.PADDLE_WIDTH_RATIO,
      height: GAME_CONSTANTS.PADDLE_HEIGHT,
    };
    
    if (checkCollision(
      { x: newX, y: newY },
      GAME_CONSTANTS.BALL_SIZE,
      paddlePosition,
      paddleSize
    )) {
      // Отскок от платформы с учетом точки удара
      const hitPosition = (newX - paddlePosition.x) / (paddleSize.width / 2);
      newVx = hitPosition * config.ballSpeed;
      newVy = -Math.abs(ballVelocity.y);
    }

    // Столкновение с кирпичами
    const remainingBricks = bricks.filter(brick => {
      if (brick.health <= 0) return false;
      
      if (checkCollision(
        { x: newX, y: newY },
        GAME_CONSTANTS.BALL_SIZE,
        brick.position,
        brick.size
      )) {
        // Уменьшение здоровья кирпича
        setGameState(prev => ({
          ...prev,
          score: prev.score + brick.points,
        }));
        
        // Определение стороны столкновения
        const fromLeft = ballVelocity.x > 0;
        const fromTop = ballVelocity.y > 0;
        
        if (Math.abs(newX - brick.position.x) > Math.abs(newY - brick.position.y)) {
          newVx = fromLeft ? -Math.abs(ballVelocity.x) : Math.abs(ballVelocity.x);
        } else {
          newVy = fromTop ? -Math.abs(ballVelocity.y) : Math.abs(ballVelocity.y);
        }
        
        return false; // Удаляем кирпич
      }
      
      return true;
    });

    // Проверка проигрыша
    if (newY >= screenHeight) {
      setGameState(prev => {
        const newLives = prev.lives - 1;
        return {
          ...prev,
          lives: newLives,
          isGameOver: newLives <= 0,
        };
      });
      
      // Сброс мяча
      newX = screenWidth / 2;
      newY = screenHeight - 120;
      newVx = config.ballSpeed;
      newVy = -config.ballSpeed;
    }

    // Проверка уровня
    if (remainingBricks.length === 0 && bricks.length > 0) {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
      }));
      initializeGame(screenWidth, screenHeight);
    }

    setBricks(remainingBricks);
    setBallPosition({ x: newX, y: newY });
    setBallVelocity({ x: newVx, y: newVy });
  }, [ballPosition, ballVelocity, bricks, gameState, paddlePosition, config, initializeGame]);

  const movePaddle = useCallback((x: number, screenWidth: number) => {
    const paddleWidth = screenWidth * GAME_CONSTANTS.PADDLE_WIDTH_RATIO;
    const halfPaddle = paddleWidth / 2;
    
    let newX = x;
    if (x < halfPaddle) newX = halfPaddle;
    if (x > screenWidth - halfPaddle) newX = screenWidth - halfPaddle;
    
    setPaddlePosition(prev => ({ ...prev, x: newX }));
  }, []);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isGameStarted: true }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = (screenWidth: number, screenHeight: number) => {
    setGameState({
      score: 0,
      lives: config.initialLives,
      level: 1,
      isPaused: false,
      isGameOver: false,
      isGameStarted: false,
    });
    initializeGame(screenWidth, screenHeight);
  };

  return {
    gameState,
    ballPosition,
    paddlePosition,
    bricks,
    initializeGame,
    updateGame,
    movePaddle,
    startGame,
    pauseGame,
    resetGame,
  };
};