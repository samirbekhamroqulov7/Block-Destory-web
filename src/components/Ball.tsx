import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Position } from '../types/gameTypes';

interface BallProps {
  position: Position;
  size: number;
}

const Ball: React.FC<BallProps> = ({ position, size }) => {
  return (
    <View
      style={[
        styles.ball,
        {
          left: position.x - size / 2,
          top: position.y - size / 2,
          width: size,
          height: size,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  ball: {
    position: 'absolute',
    backgroundColor: '#FF6B6B',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Ball;