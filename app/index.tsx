"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, PanResponder } from "react-native"
import { GameEngine, getBlockColor, GRID_WIDTH, GRID_HEIGHT } from "@/lib/gameEngine"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

const GameScreen = () => {
  const [gameEngine] = useState(() => new GameEngine())
  const [gameState, setGameState] = useState(gameEngine)
  const [highScore, setHighScore] = useState(0)
  const animationRef = useRef()
  const lastTimeRef = useRef(Date.now())

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX / screenWidth
        gameEngine.updatePaddlePosition(x)
        setGameState({ ...gameEngine })
      },
    }),
  ).current

  useEffect(() => {
    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastTimeRef.current) / 1000
      lastTimeRef.current = now

      gameEngine.update(deltaTime)
      setGameState({ ...gameEngine })

      if (!gameEngine.isGameOver) {
        animationRef.current = requestAnimationFrame(animate)
      }
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

  const gameAreaWidth = screenWidth * 0.95
  const gameAreaHeight = screenHeight * 0.65
  const blockWidth = gameAreaWidth / GRID_WIDTH
  const blockHeight = gameAreaHeight / GRID_HEIGHT

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Header Decorative Line */}
      <View style={styles.decorativeLine} />

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.label}>RECORD</Text>
          <Text style={styles.scoreText}>{highScore.toString().padStart(7, "0")}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.label}>SCORE</Text>
          <Text style={styles.scoreText}>{gameState.score.toString().padStart(7, "0")}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.label}>LEVEL</Text>
          <Text style={styles.scoreText}>{gameState.level}</Text>
        </View>
      </View>

      {/* Game Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>BLOCK</Text>
        <Text style={styles.subtitle}>DESCRIPTION</Text>
      </View>

      {/* Game Area */}
      <View
        style={[
          styles.gameArea,
          {
            width: gameAreaWidth,
            height: gameAreaHeight,
          },
        ]}
      >
        {/* Blocks */}
        {gameState.blocks.map((block) => (
          <View
            key={block.id}
            style={[
              styles.block,
              {
                left: (block.x / GRID_WIDTH) * gameAreaWidth,
                top: (block.y / GRID_HEIGHT) * gameAreaHeight,
                width: blockWidth - 4,
                height: blockHeight - 4,
                backgroundColor: getBlockColor(block.health),
              },
            ]}
          >
            {block.isSpecial && <Text style={styles.blockText}>{block.specialValue}</Text>}
            {!block.isSpecial && block.health > 1 && <Text style={styles.blockText}>{block.health}</Text>}
          </View>
        ))}

        {/* Balls */}
        {gameState.balls.map((ball, idx) => (
          <View
            key={idx}
            style={[
              styles.ball,
              {
                left: ball.x * gameAreaWidth - 6,
                top: ball.y * gameAreaHeight - 6,
              },
            ]}
          />
        ))}

        {/* Paddle */}
        <View
          style={[
            styles.paddle,
            {
              left: gameState.paddle.x * gameAreaWidth,
              width: gameState.paddle.width * gameAreaWidth,
              top: gameAreaHeight - 30,
            },
          ]}
        />
      </View>

      {/* Bottom Decorative Line */}
      <View style={styles.decorativeLine} />

      {/* Game Over Screen */}
      {gameState.isGameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverTitle}>GAME OVER</Text>
            <Text style={styles.gameOverScore}>Score: {gameState.score}</Text>
            <Text style={styles.gameOverScore}>Level: {gameState.level}</Text>
            <TouchableOpacity style={styles.restartButton} onPress={handleReset}>
              <Text style={styles.restartButtonText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a14",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingBottom: 20,
  },
  decorativeLine: {
    width: "100%",
    height: 3,
    backgroundColor: "#FF6B9D",
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "95%",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  scoreBox: {
    alignItems: "center",
  },
  label: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  scoreText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#4DD0E1",
    textShadowColor: "#FF6B9D",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFD700",
    textShadowColor: "#4DD0E1",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  gameArea: {
    backgroundColor: "#1a1a2e",
    borderWidth: 3,
    borderColor: "#4DD0E1",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    marginBottom: 10,
  },
  block: {
    position: "absolute",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  blockText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  ball: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  paddle: {
    position: "absolute",
    height: 20,
    backgroundColor: "#4DD0E1",
    borderRadius: 10,
    shadowColor: "#4DD0E1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  gameOverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverContainer: {
    backgroundColor: "#1a1a2e",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF6B9D",
  },
  gameOverTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 15,
  },
  gameOverScore: {
    fontSize: 18,
    color: "#FFD700",
    marginBottom: 8,
  },
  restartButton: {
    backgroundColor: "#4DD0E1",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  restartButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default GameScreen

