import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { DeviceInfo } from '../types/gameTypes';

interface GameBoardProps {
  children: React.ReactNode;
  deviceInfo: DeviceInfo;
}

const GameBoard: React.FC<GameBoardProps> = ({ children, deviceInfo }) => {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={[
      styles.container,
      {
        width: width,
        height: height,
        paddingHorizontal: deviceInfo.isTablet ? 20 : 10,
        paddingVertical: deviceInfo.isTablet ? 40 : 20,
      }
    ]}>
      <View style={[
        styles.board,
        {
          borderRadius: deviceInfo.isTablet ? 20 : 15,
          borderWidth: deviceInfo.isTablet ? 3 : 2,
        }
      ]}>
        {/* Фоновый градиент */}
        <View style={styles.backgroundGradient} />
        
        {/* Декоративные элементы */}
        <View style={styles.cornerDecorations}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        
        {/* Игровые элементы */}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0F3460',
    borderColor: '#4ECDC4',
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#16213E',
    opacity: 0.8,
  },
  cornerDecorations: {
    ...StyleSheet.absoluteFillObject,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFD166',
  },
  topLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 10,
    right: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
});

export default GameBoard;