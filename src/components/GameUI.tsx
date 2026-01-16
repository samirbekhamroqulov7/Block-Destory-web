import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { GameState, DeviceInfo } from '../types/gameTypes';
import { getResponsiveFontSize, getButtonSize } from '../utils/deviceUtils';

interface GameUIProps {
  gameState: GameState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onExit: () => void;
  deviceInfo: DeviceInfo;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  onStart,
  onPause,
  onReset,
  onExit,
  deviceInfo,
}) => {
  const handleButtonPress = (action: () => void) => {
    Vibration.vibrate(30);
    action();
  };

  const buttonSize = getButtonSize(deviceInfo);

  return (
    <View style={[
      styles.container,
      {
        padding: deviceInfo.isTablet ? 20 : 15,
      }
    ]}>
      {/* Статистика игры */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[
            styles.statLabel,
            { fontSize: getResponsiveFontSize(12, deviceInfo) }
          ]}>
            СЧЕТ
          </Text>
          <Text style={[
            styles.statValue,
            { fontSize: getResponsiveFontSize(24, deviceInfo) }
          ]}>
            {gameState.score}
          </Text>
        </View>
        
        <View style={styles.livesContainer}>
          <Text style={[
            styles.livesLabel,
            { fontSize: getResponsiveFontSize(12, deviceInfo) }
          ]}>
            ЖИЗНИ:
          </Text>
          {Array.from({ length: gameState.lives }).map((_, index) => (
            <View key={index} style={[
              styles.lifeIcon,
              deviceInfo.isTablet && styles.lifeIconTablet
            ]} />
          ))}
        </View>
        
        <View style={styles.statItem}>
          <Text style={[
            styles.statLabel,
            { fontSize: getResponsiveFontSize(12, deviceInfo) }
          ]}>
            УРОВЕНЬ
          </Text>
          <Text style={[
            styles.statValue,
            { fontSize: getResponsiveFontSize(24, deviceInfo) }
          ]}>
            {gameState.level}
          </Text>
        </View>
      </View>

      {/* Панель управления */}
      <View style={[
        styles.controlsContainer,
        { marginTop: deviceInfo.isTablet ? 20 : 15 }
      ]}>
        {!gameState.isGameStarted ? (
          <TouchableOpacity
            style={[
              styles.button,
              styles.startButton,
              buttonSize
            ]}
            onPress={() => handleButtonPress(onStart)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.buttonText,
              { fontSize: getResponsiveFontSize(18, deviceInfo) }
            ]}>
              ИГРАТЬ
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.gameControls}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.controlButton,
                buttonSize
              ]}
              onPress={() => handleButtonPress(onPause)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.buttonText,
                { fontSize: getResponsiveFontSize(16, deviceInfo) }
              ]}>
                {gameState.isPaused ? '▶' : '⏸'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.resetButton,
                buttonSize
              ]}
              onPress={() => handleButtonPress(onReset)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.buttonText,
                { fontSize: getResponsiveFontSize(16, deviceInfo) }
              ]}>
                ↻
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Сообщения о состоянии игры */}
      {gameState.isGameOver && (
        <View style={styles.messageOverlay}>
          <View style={[
            styles.messageContainer,
            deviceInfo.isTablet && styles.messageContainerTablet
          ]}>
            <Text style={[
              styles.gameOverText,
              { fontSize: getResponsiveFontSize(32, deviceInfo) }
            ]}>
              КОНЕЦ ИГРЫ
            </Text>
            <Text style={[
              styles.finalScoreText,
              { fontSize: getResponsiveFontSize(20, deviceInfo) }
            ]}>
              Счет: {gameState.score}
            </Text>
            <Text style={[
              styles.finalLevelText,
              { fontSize: getResponsiveFontSize(16, deviceInfo) }
            ]}>
              Уровень: {gameState.level}
            </Text>
            
            <View style={styles.gameOverButtons}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.restartButton,
                  { width: buttonSize.width * 1.5 }
                ]}
                onPress={() => handleButtonPress(onReset)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.buttonText,
                  { fontSize: getResponsiveFontSize(18, deviceInfo) }
                ]}>
                  ИГРАТЬ СНОВА
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.exitButton,
                  { width: buttonSize.width * 1.2 }
                ]}
                onPress={onExit}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.buttonText,
                  { fontSize: getResponsiveFontSize(16, deviceInfo) }
                ]}>
                  ВЫЙТИ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {gameState.isPaused && !gameState.isGameOver && (
        <View style={styles.messageOverlay}>
          <View style={[
            styles.messageContainer,
            deviceInfo.isTablet && styles.messageContainerTablet
          ]}>
            <Text style={[
              styles.pauseText,
              { fontSize: getResponsiveFontSize(28, deviceInfo) }
            ]}>
              ПАУЗА
            </Text>
            <TouchableOpacity
              style={[
                styles.button,
                styles.resumeButton,
                { width: buttonSize.width * 1.2 }
              ]}
              onPress={() => handleButtonPress(onPause)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.buttonText,
                { fontSize: getResponsiveFontSize(18, deviceInfo) }
              ]}>
                ПРОДОЛЖИТЬ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  statLabel: {
    color: '#4ECDC4',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statValue: {
    color: '#FFF',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  livesLabel: {
    color: '#4ECDC4',
    fontWeight: 'bold',
    marginRight: 10,
  },
  lifeIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
    marginHorizontal: 3,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  lifeIconTablet: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  controlsContainer: {
    alignItems: 'center',
  },
  gameControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  startButton: {
    backgroundColor: '#06D6A0',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  controlButton: {
    backgroundColor: '#118AB2',
  },
  resetButton: {
    backgroundColor: '#FFD166',
  },
  resumeButton: {
    backgroundColor: '#4ECDC4',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  restartButton: {
    backgroundColor: '#06D6A0',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  exitButton: {
    backgroundColor: '#EF476F',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  messageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  messageContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4ECDC4',
    minWidth: 250,
  },
  messageContainerTablet: {
    padding: 35,
    minWidth: 300,
  },
  gameOverText: {
    color: '#EF476F',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  finalScoreText: {
    color: '#FFD166',
    fontWeight: '600',
    marginBottom: 5,
  },
  finalLevelText: {
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 20,
  },
  gameOverButtons: {
    alignItems: 'center',
    gap: 15,
  },
  pauseText: {
    color: '#FFD166',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});

export default GameUI;