import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Brick, Position, Size, DeviceInfo } from '../types/gameTypes';
import { getGameConfig, GAME_CONSTANTS, BRICK_COLORS } from '../utils/gameConfig';

export const useGameLogic = (deviceInfo: DeviceInfo) => {
  const config = getGameConfig(deviceInfo);
  const animationRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>();

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: config.initialLives,
    level: 1,
    isPaused: false,
    isGameOver: false,
    isGameStarted: false,
  });

  const [ballPosition, setBallPosition] = useState<Position>({ x: 400, y: 300 });
  const [ballVelocity, setBallVelocity] = useState<Position>({ x: 5, y: -5 });
  const [paddlePosition, setPaddlePosition] = useState<Position>({ x: 400, y: 550 });
  const [bricks, setBricks] = useState<Brick[]>([]);

  const checkCollision = useCallback((
    ballPos: Position,
    ballSize: number,
    rectPos: Position,
    rectSize: Size
  ): boolean => {
    const ballRadius = ballSize / 2;
    const closestX = Math.max(
      rectPos.x,
      Math.min(ballPos.x, rectPos.x + rectSize.width)
    );
    const closestY = Math.max(
      rectPos.y,
      Math.min(ballPos.y, rectPos.y + rectSize.height)
    );
    const distanceX = ballPos.x - closestX;
    const distanceY = ballPos.y - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;
    return distanceSquared < (ballRadius * ballRadius);
  }, []);

  const initializeGame = useCallback(() => {
    // Инициализация кирпичей
    const brickWidth = 80;
    const newBricks: Brick[] = [];

    for (let row = 0; row < config.brickRows; row++) {
      for (let col = 0; col < config.brickCols; col++) {
        const brickX = col * (brickWidth + GAME_CONSTANTS.BRICK_MARGIN) + 50;
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
    setBallPosition({ x: 400, y: 300 });
    setBallVelocity({ x: config.ballSpeed, y: -config.ballSpeed });
    setPaddlePosition({ x: 400, y: 550 });
  }, [config]);

  const updateGame = useCallback(() => {
    if (gameState.isPaused || gameState.isGameOver || !gameState.isGameStarted) {
      return;
    }

    setBallPosition(prev => {
      let newX = prev.x + ballVelocity.x;
      let newY = prev.y + ballVelocity.y;
      let newVx = ballVelocity.x;
      let newVy = ballVelocity.y;

      // Столкновение со стенами
      if (newX <= GAME_CONSTANTS.BALL_SIZE / 2 || newX >= 800 - GAME_CONSTANTS.BALL_SIZE / 2) {
        newVx = -ballVelocity.x;
      }
      if (newY <= GAME_CONSTANTS.BALL_SIZE / 2) {
        newVy = -ballVelocity.y;
      }

      // Столкновение с платформой
      const paddleSize: Size = {
        width: 800 * GAME_CONSTANTS.PADDLE_WIDTH_RATIO,
        height: GAME_CONSTANTS.PADDLE_HEIGHT,
      };

      if (checkCollision(
        { x: newX, y: newY },
        GAME_CONSTANTS.BALL_SIZE,
        paddlePosition,
        paddleSize
      )) {
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
          setGameState(prevState => ({
            ...prevState,
            score: prevState.score + brick.points,
          }));

          const fromLeft = ballVelocity.x > 0;
          const fromTop = ballVelocity.y > 0;

          if (Math.abs(newX - brick.position.x) > Math.abs(newY - brick.position.y)) {
            newVx = fromLeft ? -Math.abs(ballVelocity.x) : Math.abs(ballVelocity.x);
          } else {
            newVy = fromTop ? -Math.abs(ballVelocity.y) : Math.abs(ballVelocity.y);
          }

          return false;
        }

        return true;
      });

      setBricks(remainingBricks);

      // Проверка проигрыша
      if (newY >= 600) {
        setGameState(prev => {
          const newLives = prev.lives - 1;
          return {
            ...prev,
            lives: newLives,
            isGameOver: newLives <= 0,
          };
        });

        newX = 400;
        newY = 300;
        newVx = config.ballSpeed;
        newVy = -config.ballSpeed;
      }

      // Проверка уровня
      if (remainingBricks.length === 0 && bricks.length > 0) {
        setGameState(prev => ({
          ...prev,
          level: prev.level + 1,
        }));
        setTimeout(initializeGame, 1000);
      }

      setBallVelocity({ x: newVx, y: newVy });
      return { x: newX, y: newY };
    });
  }, [gameState, ballVelocity, bricks, paddlePosition, config, checkCollision, initializeGame]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gameState.isGameStarted && !gameState.isPaused && !gameState.isGameOver) {
      const gameLoop = (timestamp: number) => {
        if (!lastUpdateTimeRef.current) {
          lastUpdateTimeRef.current = timestamp;
        }

        const deltaTime = timestamp - lastUpdateTimeRef.current;

        if (deltaTime >= 16) { // ~60 FPS
          lastUpdateTimeRef.current = timestamp;
          updateGame();
        }

        animationRef.current = requestAnimationFrame(gameLoop);
      };

      animationRef.current = requestAnimationFrame(gameLoop);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [gameState.isGameStarted, gameState.isPaused, gameState.isGameOver, updateGame]);

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

  const resetGame = () => {
    setGameState({
      score: 0,
      lives: config.initialLives,
      level: 1,
      isPaused: false,
      isGameOver: false,
      isGameStarted: false,
    });
    initializeGame();
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