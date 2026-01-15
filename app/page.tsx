"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { GameEngine, getBlockColor, GRID_WIDTH, GRID_HEIGHT } from "@/lib/gameEngine"

export default function GamePage() {
  const [gameEngine] = useState(() => new GameEngine())
  const [gameState, setGameState] = useState(gameEngine)
  const [highScore, setHighScore] = useState(0)
  const [mouseX, setMouseX] = useState(0.5)
  const [dimensions, setDimensions] = useState({
    width: 600,
    height: 720,
    blockWidth: 600 / GRID_WIDTH,
    blockHeight: 720 / GRID_HEIGHT
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef(Date.now())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateDimensions = () => {
        const width = Math.min(600, window.innerWidth * 0.95)
        const height = width * 1.2
        setDimensions({
          width,
          height,
          blockWidth: width / GRID_WIDTH,
          blockHeight: height / GRID_HEIGHT
        })
      }

      updateDimensions()
      window.addEventListener('resize', updateDimensions)
      
      return () => window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouseX((e.clientX - rect.left) / rect.width)
    gameEngine.updatePaddlePosition((e.clientX - rect.left) / rect.width)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const touch = e.touches[0]
    const x = (touch.clientX - rect.left) / rect.width
    setMouseX(x)
    gameEngine.updatePaddlePosition(x)
  }

  useEffect(() => {
    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastTimeRef.current) / 1000
      lastTimeRef.current = now

      gameEngine.update(deltaTime)
      setGameState({ ...gameEngine })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameEngine])

  const handleReset = () => {
    if (gameEngine.score > highScore) {
      setHighScore(gameEngine.score)
    }
    gameEngine.reset()
    lastTimeRef.current = Date.now()
    setGameState({ ...gameEngine })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-start pt-6 px-4">
      {/* Header Decorative Line */}
      <div className="w-full h-1 bg-pink-500 rounded-full mb-6 shadow-lg shadow-pink-500/50" />

      {/* Score Display */}
      <div className="flex justify-around gap-8 w-full max-w-2xl mb-6">
        <div className="text-center">
          <p className="text-gray-500 text-xs font-bold tracking-widest">RECORD</p>
          <p className="text-yellow-400 text-2xl font-bold tabular-nums">{highScore.toString().padStart(7, "0")}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs font-bold tracking-widest">SCORE</p>
          <p className="text-yellow-400 text-2xl font-bold tabular-nums">
            {gameState.score.toString().padStart(7, "0")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs font-bold tracking-widest">LEVEL</p>
          <p className="text-yellow-400 text-2xl font-bold">{gameState.level}</p>
        </div>
      </div>

      {/* Game Title */}
      <div className="mb-6 text-center">
        <h1 className="text-5xl font-black text-cyan-400 drop-shadow-lg" style={{ textShadow: "3px 3px 0px #FF6B9D" }}>
          BLOCK
        </h1>
        <h2
          className="text-5xl font-black text-yellow-400 drop-shadow-lg"
          style={{ textShadow: "3px 3px 0px #4DD0E1" }}
        >
          DESCRIPTION
        </h2>
      </div>

      {/* Game Area */}
      <div
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative bg-slate-900 border-4 border-cyan-400 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-400/30 cursor-none"
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        {/* Blocks */}
        {gameState.blocks.map((block) => (
          <div
            key={block.id}
            className="absolute rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-transform hover:scale-105"
            style={{
              left: (block.x / GRID_WIDTH) * dimensions.width,
              top: (block.y / GRID_HEIGHT) * dimensions.height,
              width: dimensions.blockWidth - 4,
              height: dimensions.blockHeight - 4,
              backgroundColor: getBlockColor(block.health),
              boxShadow: `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 8px ${getBlockColor(block.health)}40`,
            }}
          >
            {block.isSpecial && <span className="text-base">{block.specialValue}</span>}
            {!block.isSpecial && block.health > 1 && <span className="text-sm">{block.health}</span>}
          </div>
        ))}

        {/* Balls */}
        {gameState.balls.map((ball, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-white shadow-lg"
            style={{
              left: ball.x * dimensions.width - 6,
              top: ball.y * dimensions.height - 6,
              width: 12,
              height: 12,
              boxShadow: "0 0 12px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5)",
            }}
          />
        ))}

        {/* Paddle */}
        <div
          className="absolute rounded-full bg-cyan-400 shadow-lg transition-all"
          style={{
            left: gameState.paddle.x * dimensions.width,
            width: gameState.paddle.width * dimensions.width,
            top: dimensions.height - 25,
            height: 20,
            boxShadow: "0 0 20px rgba(77, 208, 225, 0.8), 0 0 30px rgba(77, 208, 225, 0.5)",
          }}
        />

        {/* Game Over Overlay */}
        {gameState.isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-slate-900 border-4 border-pink-500 rounded-3xl p-8 text-center shadow-2xl">
              <h3 className="text-4xl font-black text-pink-500 mb-4">GAME OVER</h3>
              <p className="text-yellow-400 text-xl font-bold mb-2">Score: {gameState.score}</p>
              <p className="text-yellow-400 text-xl font-bold mb-6">Level: {gameState.level}</p>
              <button
                onClick={handleReset}
                className="bg-cyan-400 hover:bg-cyan-300 text-black font-black px-8 py-3 rounded-xl transition-colors shadow-lg"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Decorative Line */}
      <div className="w-full h-1 bg-pink-500 rounded-full mt-6 shadow-lg shadow-pink-500/50" />

      {/* Instructions */}
      <div className="mt-6 text-center text-gray-400 text-sm max-w-2xl">
        <p>Move your mouse/finger to control the paddle. Break all blocks and reach the highest level!</p>
      </div>
    </div>
  )
}