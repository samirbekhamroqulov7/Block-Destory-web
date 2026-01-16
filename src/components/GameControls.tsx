import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Vibration,
} from 'react-native';
import { DeviceInfo } from '../types/gameTypes';

interface GameControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onPause: () => void;
  deviceInfo: DeviceInfo;
  isPaused: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onLeft,
  onRight,
  onPause,
  deviceInfo,
  isPaused,
}) => {
  const handlePress = (action: () => void) => {
    Vibration.vibrate(20);
    action();
  };

  const buttonSize = deviceInfo.isTablet ? 80 : 60;
  const fontSize = deviceInfo.isTablet ? 32 : 24;

  return (
    <View style={[
      styles.container,
      {
        paddingBottom: deviceInfo.isTablet ? 40 : 30,
      }
    ]}>
      <View style={styles.dPadContainer}>
        {/* Левая кнопка */}
        <TouchableOpacity
          style={[
            styles.dPadButton,
            styles.leftButton,
            {
              width: buttonSize,
              height: buttonSize,
            }
          ]}
          onPressIn={() => handlePress(onLeft)}
          onPressOut={onRight} // Сбрасываем направление при отпускании
          activeOpacity={0.6}
          delayPressIn={0}
        >
          <Text style={[
            styles.buttonArrow,
            { fontSize }
          ]}>
            ←
          </Text>
        </TouchableOpacity>

        {/* Кнопка паузы */}
        <TouchableOpacity
          style={[
            styles.pauseButton,
            {
              width: buttonSize * 0.8,
              height: buttonSize * 0.8,
            }
          ]}
          onPress={() => handlePress(onPause)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.pauseText,
            { fontSize: fontSize * 0.8 }
          ]}>
            {isPaused ? '▶' : '⏸'}
          </Text>
        </TouchableOpacity>

        {/* Правая кнопка */}
        <TouchableOpacity
          style={[
            styles.dPadButton,
            styles.rightButton,
            {
              width: buttonSize,
              height: buttonSize,
            }
          ]}
          onPressIn={() => handlePress(onRight)}
          onPressOut={onLeft} // Сбрасываем направление при отпускании
          activeOpacity={0.6}
          delayPressIn={0}
        >
          <Text style={[
            styles.buttonArrow,
            { fontSize }
          ]}>
            →
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Подпись для кнопок */}
      <Text style={[
        styles.instructions,
        { fontSize: deviceInfo.isTablet ? 14 : 12 }
      ]}>
        Управление платформой
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  dPadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    maxWidth: 350,
  },
  dPadButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.9)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  leftButton: {
    marginRight: 'auto',
  },
  rightButton: {
    marginLeft: 'auto',
  },
  buttonArrow: {
    color: '#FFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pauseButton: {
    backgroundColor: 'rgba(255, 209, 102, 0.9)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  pauseText: {
    color: '#FFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instructions: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default GameControls;