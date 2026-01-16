'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT,
  BALL_SIZE,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_ROWS,
  BRICK_COLUMNS,
  POWERUP_SIZE,
  POWERUP_SPEED,
  MAX_BALLS,
  type Brick,
  type Ball,
  type PowerUp,
  type Trajectory,
  createBrick,
  getBrickColor,
  calculateTrajectory
} from '@/lib/gameUtils'

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameWin, setGameWin] = useState(false)
  const [score, setScore] = useState(0)
  const [balls, setBalls] = useState<Ball[]>([{
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 100,
    dx: 0,
    dy: 0,
    radius: BALL_SIZE,
    active: true
  }])
  const [paddleX, setPaddleX] = useState(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2)
  const [bricks, setBricks] = useState<Brick[]>([])
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [trajectory, setTrajectory] = useState<Trajectory>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    visible: false
  })
  const [paddleWidth, setPaddleWidth] = useState(PADDLE_WIDTH)
  const [isMobile, setIsMobile] = useState(false)

  // Инициализация кирпичей
  const initBricks = useCallback(() => {
    const newBricks: Brick[] = []
    const brickPadding = 8
    const offsetTop = 50
    const offsetLeft = 20

    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLUMNS; c++) {
        newBricks.push(
          createBrick(
            c * (BRICK_WIDTH + brickPadding) + offsetLeft,
            r * (BRICK_HEIGHT + brickPadding) + offsetTop
          )
        )
      }
    }
    setBricks(newBricks)
  }, [])

  // Определение устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
        window.innerWidth <= 768
      )
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Инициализация игры
  useEffect(() => {
    initBricks()
    setPaddleWidth(PADDLE_WIDTH)
  }, [initBricks])

  // Обработка мыши/тача для свайпа
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      if (!gameStarted || balls.length === 0) return
      
      const rect = canvas.getBoundingClientRect()
      let clientX, clientY
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      
      const x = clientX - rect.left
      const y = clientY - rect.top
      
      // Проверяем, что клик рядом с мячом
      const ball = balls[0]
      const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2)
      
      if (distance < 50) {
        setIsDragging(true)
        setTrajectory({
          startX: ball.x,
          startY: ball.y,
          endX: x,
          endY: y,
          visible: true
        })
      }
    }

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !gameStarted) return
      
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      let clientX, clientY
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      
      const x = clientX - rect.left
      const y = clientY - rect.top
      
      setTrajectory(prev => ({
        ...prev,
        endX: x,
        endY: y
      }))
    }

    const handleMouseUp = () => {
      if (!isDragging || !gameStarted) return
      
      setIsDragging(false)
      setTrajectory(prev => ({ ...prev, visible: false }))
      
      // Запускаем мяч по траектории
      const ball = balls[0]
      const { dx, dy } = calculateTrajectory(
        trajectory.startX,
        trajectory.startY,
        trajectory.endX,
        trajectory.endY
      )
      
      setBalls(prev => prev.map((b, i) => 
        i === 0 ? { ...b, dx, dy } : b
      ))
    }

    // События мыши
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)
    
    // События тача
    canvas.addEventListener('touchstart', handleMouseDown, { passive: false })
    canvas.addEventListener('touchmove', handleMouseMove, { passive: false })
    canvas.addEventListener('touchend', handleMouseUp)
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)
      canvas.removeEventListener('touchstart', handleMouseDown)
      canvas.removeEventListener('touchmove', handleMouseMove)
      canvas.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, gameStarted, balls, trajectory])

  // Игровой цикл
  useEffect(() => {
    if (!gameStarted || gameOver || gameWin) return

    const updateGame = () => {
      // Обновление позиции мячей
      setBalls(prev => prev.map(ball => {
        if (!ball.active) return ball
        
        let newBall = { ...ball }
        
        // Движение
        newBall.x += newBall.dx
        newBall.y += newBall.dy
        
        // Отскок от стен
        if (newBall.x - newBall.radius <= 0 || 
            newBall.x + newBall.radius >= CANVAS_WIDTH) {
          newBall.dx = -newBall.dx
        }
        if (newBall.y - newBall.radius <= 0) {
          newBall.dy = -newBall.dy
        }
        
        // Отскок от пола
        if (newBall.y + newBall.radius >= CANVAS_HEIGHT) {
          newBall.active = false
        }
        
        // Отскок от платформы
        if (
          newBall.y + newBall.radius >= CANVAS_HEIGHT - PADDLE_HEIGHT &&
          newBall.y < CANVAS_HEIGHT &&
          newBall.x + newBall.radius > paddleX &&
          newBall.x - newBall.radius < paddleX + paddleWidth
        ) {
          const hitPos = (newBall.x - paddleX) / paddleWidth
          newBall.dx = (hitPos - 0.5) * 10
          newBall.dy = -Math.abs(newBall.dy)
        }
        
        return newBall
      }))

      // Проверка столкновений с кирпичами
      setBricks(prev => prev.map(brick => {
        if (brick.hp <= 0) return brick
        
        const newBrick = { ...brick }
        
        balls.forEach(ball => {
          if (!ball.active) return
          
          // Проверка столкновения
          if (
            ball.x + ball.radius > brick.x &&
            ball.x - ball.radius < brick.x + brick.width &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.height
          ) {
            newBrick.hp -= 1
            setScore(s => s + 10)
            
            // Отскок
            const ballCopy = { ...ball }
            if (Math.abs(ball.x - brick.x) < Math.abs(ball.y - brick.y)) {
              ballCopy.dy = -ballCopy.dy
            } else {
              ballCopy.dx = -ballCopy.dx
            }
            
            // Обновление цвета
            if (newBrick.hp > 0) {
              newBrick.color = getBrickColor(newBrick.hp, newBrick.maxHp)
            } else {
              // Шанс выпадения бонуса
              if (Math.random() < 0.2) {
                const newPowerUp: PowerUp = {
                  x: brick.x + brick.width / 2,
                  y: brick.y + brick.height / 2,
                  type: Math.random() < 0.5 ? 'extra_ball' : 
                        Math.random() < 0.7 ? 'paddle_size' : 'ball_speed',
                  active: true
                }
                setPowerUps(p => [...p, newPowerUp])
              }
            }
          }
        })
        
        return newBrick
      }))

      // Обновление бонусов
      setPowerUps(prev => prev
        .map(powerUp => ({
          ...powerUp,
          y: powerUp.y + POWERUP_SPEED
        }))
        .filter(powerUp => {
          if (powerUp.y > CANVAS_HEIGHT) return false
          
          // Проверка сбора бонуса платформой
          if (
            powerUp.y + POWERUP_SIZE > CANVAS_HEIGHT - PADDLE_HEIGHT &&
            powerUp.x + POWERUP_SIZE > paddleX &&
            powerUp.x < paddleX + paddleWidth
          ) {
            activatePowerUp(powerUp.type)
            return false
          }
          
          return true
        })
      )

      // Проверка победы
      if (bricks.every(b => b.hp <= 0)) {
        setGameWin(true)
        return
      }

      // Проверка проигрыша
      const activeBalls = balls.filter(b => b.active)
      if (activeBalls.length === 0) {
        setGameOver(true)
        return
      }

      animationRef.current = requestAnimationFrame(updateGame)
    }

    animationRef.current = requestAnimationFrame(updateGame)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameStarted, gameOver, gameWin, balls, bricks, powerUps, paddleX, paddleWidth])

  // Активация бонуса
  const activatePowerUp = (type: 'extra_ball' | 'paddle_size' | 'ball_speed') => {
    switch (type) {
      case 'extra_ball':
        if (balls.length < MAX_BALLS) {
          const newBall: Ball = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 100,
            dx: (Math.random() - 0.5) * 8,
            dy: -5,
            radius: BALL_SIZE,
            active: true
          }
          setBalls(prev => [...prev, newBall])
        }
        break
        
      case 'paddle_size':
        setPaddleWidth(prev => Math.min(prev + 30, 200))
        setTimeout(() => setPaddleWidth(PADDLE_WIDTH), 10000)
        break
        
      case 'ball_speed':
        setBalls(prev => prev.map(ball => ({
          ...ball,
          dx: ball.dx * 1.5,
          dy: ball.dy * 1.5
        })))
        break
    }
  }

  // Начало игры
  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setGameWin(false)
    setScore(0)
    setBalls([{
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 100,
      dx: 0,
      dy: 0,
      radius: BALL_SIZE,
      active: true
    }])
    setPaddleX(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2)
    setPaddleWidth(PADDLE_WIDTH)
    setPowerUps([])
    initBricks()
  }

  // Рендеринг на канвасе
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Очистка канваса
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Рисование кирпичей
    bricks.forEach(brick => {
      if (brick.hp <= 0) return
      
      ctx.fillStyle = brick.color
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
      
      // Обводка
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
      
      // Отображение HP
      ctx.fillStyle = 'white'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(
        `${brick.hp}/${brick.maxHp}`,
        brick.x + brick.width / 2,
        brick.y + brick.height / 2 + 4
      )
    })
    
    // Рисование платформы
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT, paddleWidth, PADDLE_HEIGHT)
    
    // Рисование мячей
    balls.forEach(ball => {
      if (!ball.active) return
      
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fillStyle = '#ef4444'
      ctx.fill()
      
      // Эффект свечения
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius + 2, 0, Math.PI * 2)
      ctx.strokeStyle = '#fca5a5'
      ctx.lineWidth = 1
      ctx.stroke()
    })
    
    // Рисование бонусов
    powerUps.forEach(powerUp => {
      ctx.beginPath()
      ctx.arc(powerUp.x, powerUp.y, POWERUP_SIZE, 0, Math.PI * 2)
      
      switch (powerUp.type) {
        case 'extra_ball':
          ctx.fillStyle = '#22c55e' // Зеленый
          break
        case 'paddle_size':
          ctx.fillStyle = '#8b5cf6' // Фиолетовый
          break
        case 'ball_speed':
          ctx.fillStyle = '#f59e0b' // Оранжевый
          break
      }
      
      ctx.fill()
      
      // Иконка на бонусе
      ctx.fillStyle = 'white'
      ctx.font = '10px Arial'
      ctx.textAlign = 'center'
      
      switch (powerUp.type) {
        case 'extra_ball':
          ctx.fillText('+1', powerUp.x, powerUp.y + 3)
          break
        case 'paddle_size':
          ctx.fillText('▲', powerUp.x, powerUp.y + 3)
          break
        case 'ball_speed':
          ctx.fillText('⚡', powerUp.x, powerUp.y + 3)
          break
      }
    })
    
    // Рисование траектории
    if (trajectory.visible && isDragging) {
      ctx.beginPath()
      ctx.moveTo(trajectory.startX, trajectory.startY)
      ctx.lineTo(trajectory.endX, trajectory.endY)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
      
      // Стрелка направления
      const angle = Math.atan2(
        trajectory.endY - trajectory.startY,
        trajectory.endX - trajectory.startX
      )
      
      ctx.beginPath()
      ctx.moveTo(trajectory.endX, trajectory.endY)
      ctx.lineTo(
        trajectory.endX - 15 * Math.cos(angle - Math.PI / 6),
        trajectory.endY - 15 * Math.sin(angle - Math.PI / 6)
      )
      ctx.moveTo(trajectory.endX, trajectory.endY)
      ctx.lineTo(
        trajectory.endX - 15 * Math.cos(angle + Math.PI / 6),
        trajectory.endY - 15 * Math.sin(angle + Math.PI / 6)
      )
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3
      ctx.stroke()
    }
    
    // Подсказка для игрока
    if (!gameStarted || balls[0]?.dx === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(
        isMobile 
          ? 'Проведите от мяча чтобы задать траекторию' 
          : 'Потяните от мяча мышкой чтобы задать траекторию',
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2
      )
    }
    
  }, [bricks, balls, powerUps, paddleX, paddleWidth, trajectory, isDragging, gameStarted, isMobile])

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-between items-center w-full max-w-2xl mb-4 gap-4">
        <div className="text-white">
          <div className="text-xl font-bold">Счёт: <span className="text-yellow-400">{score}</span></div>
          <div className="text-lg">Мячи: <span className="text-green-400">{balls.filter(b => b.active).length}</span></div>
        </div>
        
        <div className="text-sm text-gray-400">
          {isMobile ? '👆 Свайп от мяча' : '🖱️ Потяните от мяча'}
        </div>
        
        <button
          onClick={startGame}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition transform hover:scale-105"
        >
          {gameStarted ? '🔄 Перезапуск' : '🚀 Начать игру'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="bg-gray-900 rounded-xl border-2 border-gray-700 shadow-xl cursor-pointer max-w-full"
        style={{ 
          maxWidth: '100%',
          height: 'auto',
          aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`
        }}
      />

      {gameOver && (
        <div className="mt-6 p-6 bg-gradient-to-b from-red-900/90 to-red-800/80 rounded-xl border border-red-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">💀 Конец игры</h2>
          <p className="text-gray-200 mb-4">Вы набрали: <span className="text-yellow-400 font-bold">{score} очков</span></p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-lg transition"
          >
            Играть снова
          </button>
        </div>
      )}

      {gameWin && (
        <div className="mt-6 p-6 bg-gradient-to-b from-green-900/90 to-emerald-800/80 rounded-xl border border-emerald-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">🎉 Победа!</h2>
          <p className="text-gray-200 mb-4">Все кирпичи разрушены! Счет: <span className="text-yellow-400 font-bold">{score}</span></p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition"
          >
            Новая игра
          </button>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
          <div className="font-bold text-blue-400 mb-1">🎯 Механика</div>
          <p>Проведите от мяча чтобы задать направление</p>
        </div>
        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
          <div className="font-bold text-green-400 mb-1">💎 Бонусы</div>
          <p>Собирайте шары для дополнительных мячей</p>
        </div>
        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
          <div className="font-bold text-yellow-400 mb-1">🧱 Кирпичи</div>
          <p>У каждого кирпича есть HP (слои)</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Адаптировано для: {isMobile ? '📱 Мобильные устройства' : '🖥️ Компьютеры'}</p>
      </div>
    </div>
  )
}