import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Position, Size } from '../types/gameTypes';

interface PaddleProps {
  position: Position;
  size: Size;
}

const Paddle: React.FC<PaddleProps> = ({ position, size }) => {
  return (
    <View
      style={[
        styles.paddle,
        {
          left: position.x - size.width / 2,
          top: position.y - size.height / 2,
          width: size.width,
          height: size.height,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  paddle: {
    position: 'absolute',
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
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

export default Paddle;