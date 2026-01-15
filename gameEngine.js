// Game engine with full block breaker logic
export const GRID_WIDTH = 6
export const GRID_HEIGHT = 8
export const BLOCK_SIZE = 50
export const PADDING = 10

// Color system for blocks based on health - cycling through 7 colors
export const getBlockColor = (health) => {
  if (health <= 10) return "#FF4444" // Red
  if (health <= 20) return "#4444FF" // Blue
  if (health <= 30) return "#FFFF44" // Yellow
  if (health <= 40) return "#8B4513" // Brown
  if (health <= 50) return "#44FF44" // Green
  if (health <= 60) return "#FF8800" // Orange
  if (health <= 70) return "#AA44FF" // Violet

  // Cycle through colors for higher health values (every 10 health points)
  const colors = ["#FF4444", "#4444FF", "#FFFF44", "#8B4513", "#44FF44", "#FF8800", "#AA44FF"]
  const cycleIndex = Math.floor((health - 80) / 10) % colors.length
  return colors[cycleIndex]
}

export class GameEngine {
  constructor() {
    this.reset()
  }

  reset() {
    this.blocks = this.generateInitialBlocks()
    this.balls = [{ x: 0.5, y: 0.85, vx: 0.3, vy: -0.5, active: true }]
    this.paddle = { x: 0.5, width: 0.2 }
    this.score = 0
    this.gameOver = false
    this.level = 1
    this.ballsHit = 0
  }

  generateInitialBlocks() {
    const blocks = []
    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        // Random health between 1-15 for initial blocks
        const health = Math.floor(Math.random() * 15) + 1
        blocks.push({
          id: `${row}-${col}`,
          x: col,
          y: row,
          health: health,
          initialHealth: health,
          isSpecial: false,
        })

        // Add special blocks (2, 5, 10 health) randomly
        if (Math.random() < 0.15) {
          const specialType = Math.random()
          if (specialType < 0.33) {
            blocks[blocks.length - 1].health = 2
            blocks[blocks.length - 1].initialHealth = 2
            blocks[blocks.length - 1].isSpecial = true
            blocks[blocks.length - 1].specialValue = 2
          } else if (specialType < 0.66) {
            blocks[blocks.length - 1].health = 5
            blocks[blocks.length - 1].initialHealth = 5
            blocks[blocks.length - 1].isSpecial = true
            blocks[blocks.length - 1].specialValue = 5
          } else {
            blocks[blocks.length - 1].health = 10
            blocks[blocks.length - 1].initialHealth = 10
            blocks[blocks.length - 1].isSpecial = true
            blocks[blocks.length - 1].specialValue = 10
          }
        }
      }
    }
    return blocks
  }

  updatePaddlePosition(x) {
    this.paddle.x = Math.max(0, Math.min(1 - this.paddle.width, x - this.paddle.width / 2))
  }

  update(deltaTime) {
    if (this.gameOver) return

    const dt = Math.min(deltaTime, 0.016) // Cap at 60fps

    // Update balls physics and collisions
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i]

      if (!ball.active) {
        this.balls.splice(i, 1)
        continue
      }

      // Ball movement
      ball.x += ball.vx * dt * 5
      ball.y += ball.vy * dt * 5

      // Wall collision
      if (ball.x <= 0 || ball.x >= 1) {
        ball.vx *= -1
        ball.x = Math.max(0, Math.min(1, ball.x))
      }

      // Ceiling collision
      if (ball.y <= 0) {
        ball.vy *= -1
      }

      // Paddle collision
      if (ball.y >= 0.85 && ball.y <= 0.95 && ball.x >= this.paddle.x && ball.x <= this.paddle.x + this.paddle.width) {
        ball.vy *= -1
        const hitPos = (ball.x - this.paddle.x) / this.paddle.width
        ball.vx = (hitPos - 0.5) * 1.5
      }

      // Block collisions
      for (const block of this.blocks) {
        const blockLeft = block.x / GRID_WIDTH
        const blockRight = (block.x + 1) / GRID_WIDTH
        const blockTop = block.y / GRID_HEIGHT
        const blockBottom = (block.y + 1) / GRID_HEIGHT

        const ballSize = 0.02

        if (
          ball.x + ballSize > blockLeft &&
          ball.x - ballSize < blockRight &&
          ball.y + ballSize > blockTop &&
          ball.y - ballSize < blockBottom
        ) {
          // Collision detection - determine which side
          const overlapLeft = ball.x - ballSize - blockLeft
          const overlapRight = blockRight - (ball.x + ballSize)
          const overlapTop = ball.y - ballSize - blockTop
          const overlapBottom = blockBottom - (ball.y + ballSize)

          const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

          if (minOverlap === overlapLeft || minOverlap === overlapRight) {
            ball.vx *= -1
          } else {
            ball.vy *= -1
          }

          // Damage block and update score
          block.health -= 1
          this.score += 10
          this.ballsHit++

          // Level progression
          if (this.ballsHit % 50 === 0) {
            this.level++
          }

          // Destroy block
          if (block.health <= 0) {
            this.blocks = this.blocks.filter((b) => b !== block)
            this.score += 100 + this.level * 10
          }

          break
        }
      }

      // Ball falls off screen
      if (ball.y > 1) {
        ball.active = false
        if (this.balls.length === 0) {
          this.gameOver = true
        }
      }
    }

    // Spawn new balls progressively
    if (Math.random() < 0.02 && this.balls.length < 3 + Math.floor(this.level / 5)) {
      this.balls.push({
        x: Math.random() * 0.3 + 0.35,
        y: 0.1,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0.5,
        active: true,
      })
    }

    // Progressive difficulty - blocks drop
    if (this.ballsHit % 100 === 0 && this.ballsHit > 0) {
      this.blocks.forEach((block) => {
        block.y = Math.min(block.y + 1, GRID_HEIGHT - 1)
      })
    }

    // Game over if blocks reach paddle
    if (this.blocks.some((b) => b.y >= GRID_HEIGHT - 1)) {
      this.gameOver = true
    }
  }

  get isGameOver() {
    return this.gameOver
  }
}
