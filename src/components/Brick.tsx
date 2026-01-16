import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Brick as BrickType } from '../types/gameTypes';

interface BrickProps {
  brick: BrickType;
}

const Brick: React.FC<BrickProps> = ({ brick }) => {
  return (
    <View
      style={[
        styles.brick,
        {
          left: brick.position.x,
          top: brick.position.y,
          width: brick.size.width,
          height: brick.size.height,
          backgroundColor: brick.color,
          opacity: brick.health > 0 ? 1 : 0,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  brick: {
    position: 'absolute',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
});

export default Brick;