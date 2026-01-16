'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Ball from './Ball'
import Paddle from './Paddle'
import Brick from './Brick'
import GameOver from './GameOver'
import { 
  BALL_SIZE, 
  PADDLE_WIDTH, 
  PADDLE_HEIGHT, 
  BRICK_WIDTH, 
  BRICK_HEIGHT,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BRICK_ROWS,
  BRICK_COLUMNS,
  PADDLE_SPEED
} from '@/lib/gameUtils'

interface BrickType {
  x: number
  y: number
  width: number
  height: number
  active: boolean
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [paddleX, setPaddleX] = useState(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2)
  const [ball, setBall] = useState({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 4, dy: -4 })
  const [bricks, setBricks] = useState<BrickType[]>([])
  const [mouseX, setMouseX] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Определение типа устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Инициализация кирпичей
  useEffect(() => {
    const initialBricks: BrickType[] = []
    const brickPadding = 10
    const offsetTop = 60
    const offsetLeft = 30

    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLUMNS; c++) {
        initialBricks.push({
          x: c * (BRICK_WIDTH + brickPadding) + offsetLeft,
          y: r * (BRICK_HEIGHT + brickPadding) + offsetTop,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          active: true
        })
      }
    }
    setBricks(initialBricks)
  }, [])

  // Обработка мыши/тача
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !gameStarted) return
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      setMouseX(x)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!canvasRef.current || !gameStarted) return
      e.preventDefault()
      const rect = canvasRef.current.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      setMouseX(x)
    }

    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('touchmove', handleTouchMove)
      }
    }
  }, [gameStarted])

  // Обновление позиции платформы
  useEffect(() => {
    if (!gameStarted) return
    
    const newPaddleX = mouseX - PADDLE_WIDTH / 2
    const clampedX = Math.max(0, Math.min(newPaddleX, CANVAS_WIDTH - PADDLE_WIDTH))
    setPaddleX(clampedX)
  }, [mouseX, gameStarted])

  // Проверка столкновений
  const checkCollisions = useCallback(() => {
    let newBall = { ...ball }
    let newBricks = [...bricks]
    let newScore = score
    let newLives = lives

    // Столкновение со стенами
    if (newBall.x + BALL_SIZE > CANVAS_WIDTH || newBall.x < 0) {
      newBall.dx = -newBall.dx
    }
    if (newBall.y < 0) {
      newBall.dy = -newBall.dy
    }

    // Столкновение с полом
    if (newBall.y + BALL_SIZE > CANVAS_HEIGHT) {
      newLives--
      if (newLives <= 0) {
        setGameOver(true)
        return { ball: newBall, bricks: newBricks, score: newScore, lives: newLives }
      }
      // Сброс мяча
      newBall = { 
        x: CANVAS_WIDTH / 2, 
        y: CANVAS_HEIGHT - 50, 
        dx: 4, 
        dy: -4 
      }
    }

    // Столкновение с платформой
    if (
      newBall.y + BALL_SIZE > CANVAS_HEIGHT - PADDLE_HEIGHT &&
      newBall.y < CANVAS_HEIGHT &&
      newBall.x + BALL_SIZE > paddleX &&
      newBall.x < paddleX + PADDLE_WIDTH
    ) {
      const hitPos = (newBall.x - paddleX) / PADDLE_WIDTH
      newBall.dx = (hitPos - 0.5) * 10
      newBall.dy = -Math.abs(newBall.dy)
    }

    // Столкновение с кирпичами
    newBricks.forEach(brick => {
      if (
        brick.active &&
        newBall.x + BALL_SIZE > brick.x &&
        newBall.x < brick.x + brick.width &&
        newBall.y + BALL_SIZE > brick.y &&
        newBall.y < brick.y + brick.height
      ) {
        brick.active = false
        newScore += 10
        newBall.dy = -newBall.dy
      }
    })

    // Проверка победы
    if (newBricks.every(brick => !brick.active)) {
      setGameOver(true)
    }

    return { ball: newBall, bricks: newBricks, score: newScore, lives: newLives }
  }, [ball, bricks, score, lives, paddleX])

  // Игровой цикл
  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) return

    let newBall = {
      x: ball.x + ball.dx,
      y: ball.y + ball.dy,
      dx: ball.dx,
      dy: ball.dy
    }

    const collisions = checkCollisions()
    newBall = collisions.ball
    
    setBall(newBall)
    setBricks(collisions.bricks)
    setScore(collisions.score)
    setLives(collisions.lives)

    requestRef.current = requestAnimationFrame(gameLoop)
  }, [gameStarted, gameOver, ball, checkCollisions])

  // Запуск игрового цикла
  useEffect(() => {
    if (gameStarted && !gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop)
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [gameStarted, gameOver, gameLoop])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setLives(3)
    setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 4, dy: -4 })
    setPaddleX(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2)
    
    // Сброс кирпичей
    const newBricks = bricks.map(brick => ({ ...brick, active: true }))
    setBricks(newBricks)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-2xl mb-4">
        <div className="text-white">
          <div className="text-xl font-bold">Счёт: {score}</div>
          <div className="text-lg">Жизни: {lives}</div>
        </div>
        <div className="text-sm text-gray-400">
          {isMobile ? 'Касайтесь и двигайте' : 'Двигайте мышь'}
        </div>
        <button
          onClick={startGame}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
        >
          {gameStarted ? 'Перезапуск' : 'Начать игру'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="bg-gray-800 rounded-xl border-2 border-gray-700 shadow-lg cursor-none"
      />

      {!gameStarted && !gameOver && (
        <div className="mt-4 text-center text-white">
          <p className="text-lg">Нажмите &quot;Начать игру&quot; чтобы начать!</p>
          <p className="text-sm text-gray-400 mt-2">
            {isMobile 
              ? 'Касайтесь и двигайте палец по экрану для управления' 
              : 'Двигайте мышь для управления платформой'}
          </p>
        </div>
      )}

      {gameOver && (
        <GameOver 
          score={score} 
          onRestart={startGame}
          isWin={bricks.every(brick => !brick.active)}
        />
      )}

      {/* Рендеринг элементов игры */}
      <div className="hidden">
        {bricks.map((brick, index) => (
          brick.active && (
            <Brick
              key={index}
              x={brick.x}
              y={brick.y}
              width={brick.width}
              height={brick.height}
            />
          )
        ))}
        <Paddle x={paddleX} />
        <Ball x={ball.x} y={ball.y} />
      </div>
    </div>
  )
}