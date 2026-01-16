import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Text,
  Vibration,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameLoop } from '../hooks/useGameLoop';
import GameBoard from '../components/GameBoard';
import GameUI from '../components/GameUI';
import GameControls from '../components/GameControls';
import Paddle from '../components/Paddle';
import Ball from '../components/Ball';
import Brick from '../components/Brick';
import { getGameDimensions } from '../utils/deviceUtils';

interface GameScreenProps {
  navigation: any;
}

const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
  const deviceInfo = useDeviceDetection();
  const { width, height } = Dimensions.get('window');
  const panResponderRef = useRef<any>(null);
  
  const {
    gameState,
    ballPosition,
    paddlePosition,
    bricks,
    initializeGame,
    updateGame,
    movePaddle,
    movePaddleLeft,
    movePaddleRight,
    stopPaddle,
    startGame,
    pauseGame,
    resetGame,
  } = useGameLogic(deviceInfo);

  // Инициализация игры
  useEffect(() => {
    initializeGame(width, height);
  }, [width, height, initializeGame]);

  // Игровой цикл
  const { pause, resume } = useGameLoop(() => {
    updateGame(width, height);
  }, 16);

  // Обработка кнопки "Назад" на Android
  useEffect(() => {
    const backAction = () => {
      if (gameState.isGameStarted && !gameState.isPaused) {
        pauseGame();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [gameState.isGameStarted, gameState.isPaused]);

  // Пауза при уходе с экрана
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (gameState.isGameStarted && !gameState.isPaused) {
        pause();
        pauseGame();
      }
    });

    const subscribe = navigation.addListener('focus', () => {
      if (gameState.isGameStarted && gameState.isPaused) {
        resume();
      }
    });

    return () => {
      unsubscribe();
      subscribe();
    };
  }, [navigation, gameState.isGameStarted, gameState.isPaused]);

  // Создание PanResponder для управления свайпами
  useEffect(() => {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        // Начало касания
        if (Platform.OS === 'ios') {
          Vibration.vibrate(10);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gameState.isGameStarted && !gameState.isPaused) {
          const touchX = evt.nativeEvent.locationX;
          movePaddle(touchX, width);
        }
      },
      onPanResponderRelease: () => {
        // Конец касания
        stopPaddle();
      },
      onPanResponderTerminate: () => {
        // Прерывание жеста
        stopPaddle();
      },
    });
  }, [gameState.isGameStarted, gameState.isPaused, width, movePaddle]);

  const gameDimensions = getGameDimensions(deviceInfo);
  const paddleSize = {
    width: width * gameDimensions.paddleWidthRatio,
    height: gameDimensions.paddleHeight,
  };

  const handleExitGame = () => {
    Alert.alert(
      'Выйти из игры?',
      'Ваш прогресс не будет сохранен.',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <GameBoard deviceInfo={deviceInfo}>
        {/* Отображение кирпичей */}
        {bricks.map(brick => (
          <Brick key={brick.id} brick={brick} />
        ))}
        
        {/* Мяч */}
        <Ball 
          position={ballPosition} 
          size={gameDimensions.ballSize} 
          deviceInfo={deviceInfo}
        />
        
        {/* Платформа */}
        <Paddle 
          position={paddlePosition} 
          size={paddleSize} 
          deviceInfo={deviceInfo}
        />
      </GameBoard>

      {/* UI управления и информации */}
      <GameUI
        gameState={gameState}
        onStart={startGame}
        onPause={pauseGame}
        onReset={() => resetGame(width, height)}
        onExit={handleExitGame}
        deviceInfo={deviceInfo}
      />

      {/* Кнопки управления для планшетов */}
      {deviceInfo.isTablet && (
        <GameControls
          onLeft={movePaddleLeft}
          onRight={movePaddleRight}
          onPause={pauseGame}
          deviceInfo={deviceInfo}
          isPaused={gameState.isPaused}
        />
      )}

      {/* Область управления для жестов (для мобильных) */}
      {!deviceInfo.isTablet && gameState.isGameStarted && !gameState.isPaused && (
        <View 
          style={styles.touchArea}
          {...panResponderRef.current?.panHandlers}
        >
          <View style={styles.touchIndicator}>
            <Text style={styles.touchText}>Свайпайте для управления</Text>
          </View>
        </View>
      )}

      {/* Кнопка выхода */}
      <TouchableOpacity
        style={[
          styles.exitButton,
          deviceInfo.isTablet && styles.exitButtonTablet
        ]}
        onPress={handleExitGame}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.exitButtonText,
          deviceInfo.isTablet && styles.exitButtonTextTablet
        ]}>← Назад</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  touchArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchIndicator: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.5)',
  },
  touchText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
  exitButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(239, 71, 111, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  exitButtonTablet: {
    top: 30,
    left: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  exitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exitButtonTextTablet: {
    fontSize: 16,
  },
});

export default GameScreen;