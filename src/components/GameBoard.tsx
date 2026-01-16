import React, { useEffect, useState } from 'react';
import { DeviceInfo } from '../types/gameTypes';

interface GameBoardProps {
  children: React.ReactNode;
  deviceInfo: DeviceInfo;
}

const GameBoard: React.FC<GameBoardProps> = ({ children, deviceInfo }) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const isTablet = dimensions.width >= 768;

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isTablet ? '40px' : '20px',
      backgroundColor: '#1A1A2E',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#0F3460',
        borderRadius: isTablet ? '20px' : '15px',
        border: `${isTablet ? '3px' : '2px'} solid #4ECDC4`,
        overflow: 'hidden',
      }}>
        {/* Фоновый градиент */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#16213E',
          opacity: 0.8,
        }} />

        {/* Декоративные углы */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
          <div style={cornerStyle('top', 'left')} />
          <div style={cornerStyle('top', 'right')} />
          <div style={cornerStyle('bottom', 'left')} />
          <div style={cornerStyle('bottom', 'right')} />
        </div>

        {/* Игровые элементы */}
        {children}
      </div>
    </div>
  );
};

const cornerStyle = (vertical: string, horizontal: string) => ({
  position: 'absolute' as const,
  width: '30px',
  height: '30px',
  [vertical]: '10px',
  [horizontal]: '10px',
  borderColor: '#FFD166',
  [`border${vertical === 'top' ? 'Top' : 'Bottom'}Width`]: '3px',
  [`border${horizontal === 'left' ? 'Left' : 'Right'}Width`]: '3px',
});

export default GameBoard;