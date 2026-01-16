import React from 'react';
import { GameState, DeviceInfo } from '../types/gameTypes';

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
  const isTablet = deviceInfo.isTablet;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: isTablet ? '20px' : '15px',
    }}>
      {/* Статистика игры */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(26, 26, 46, 0.9)',
        borderRadius: '15px',
        padding: '12px 15px',
        marginBottom: '20px',
      }}>
        <div style={{ textAlign: 'center', minWidth: '60px' }}>
          <div style={{ color: '#4ECDC4', fontWeight: 'bold', fontSize: isTablet ? '14px' : '12px' }}>
            СЧЕТ
          </div>
          <div style={{ color: '#FFF', fontWeight: '900', fontSize: isTablet ? '28px' : '24px' }}>
            {gameState.score}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ color: '#4ECDC4', fontWeight: 'bold', fontSize: isTablet ? '14px' : '12px', marginRight: '10px' }}>
            ЖИЗНИ:
          </div>
          {Array.from({ length: gameState.lives }).map((_, index) => (
            <div key={index} style={{
              width: isTablet ? '20px' : '16px',
              height: isTablet ? '20px' : '16px',
              borderRadius: '50%',
              backgroundColor: '#FF6B6B',
              margin: '0 3px',
              border: '2px solid #FFF',
            }} />
          ))}
        </div>

        <div style={{ textAlign: 'center', minWidth: '60px' }}>
          <div style={{ color: '#4ECDC4', fontWeight: 'bold', fontSize: isTablet ? '14px' : '12px' }}>
            УРОВЕНЬ
          </div>
          <div style={{ color: '#FFF', fontWeight: '900', fontSize: isTablet ? '28px' : '24px' }}>
            {gameState.level}
          </div>
        </div>
      </div>

      {/* Кнопки управления */}
      <div style={{ textAlign: 'center' }}>
        {!gameState.isGameStarted ? (
          <button
            onClick={onStart}
            style={{
              backgroundColor: '#06D6A0',
              color: '#FFF',
              border: '2px solid #FFF',
              borderRadius: '12px',
              padding: isTablet ? '15px 30px' : '12px 24px',
              fontSize: isTablet ? '20px' : '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 3px 5px rgba(0,0,0,0.3)',
            }}
          >
            ИГРАТЬ
          </button>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button
              onClick={onPause}
              style={buttonStyle('#118AB2', isTablet)}
            >
              {gameState.isPaused ? '▶' : '⏸'}
            </button>
            <button
              onClick={onReset}
              style={buttonStyle('#FFD166', isTablet)}
            >
              ↻
            </button>
          </div>
        )}
      </div>

      {/* Сообщения о состоянии игры */}
      {(gameState.isGameOver || gameState.isPaused) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 200,
        }}>
          <div style={{
            backgroundColor: 'rgba(26, 26, 46, 0.95)',
            borderRadius: '20px',
            padding: isTablet ? '35px' : '25px',
            textAlign: 'center',
            border: '3px solid #4ECDC4',
            minWidth: isTablet ? '300px' : '250px',
          }}>
            {gameState.isGameOver ? (
              <>
                <h2 style={{ color: '#EF476F', marginBottom: '15px', fontSize: isTablet ? '32px' : '28px' }}>
                  КОНЕЦ ИГРЫ
                </h2>
                <p style={{ color: '#FFD166', fontSize: isTablet ? '22px' : '18px', marginBottom: '5px' }}>
                  Счет: {gameState.score}
                </p>
                <p style={{ color: '#FFF', opacity: 0.8, marginBottom: '20px' }}>
                  Уровень: {gameState.level}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <button
                    onClick={onReset}
                    style={bigButtonStyle('#06D6A0', isTablet)}
                  >
                    ИГРАТЬ СНОВА
                  </button>
                  <button
                    onClick={onExit}
                    style={bigButtonStyle('#EF476F', isTablet)}
                  >
                    ВЫЙТИ
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ color: '#FFD166', marginBottom: '20px', fontSize: isTablet ? '28px' : '24px' }}>
                  ПАУЗА
                </h2>
                <button
                  onClick={onPause}
                  style={bigButtonStyle('#4ECDC4', isTablet)}
                >
                  ПРОДОЛЖИТЬ
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const buttonStyle = (color: string, isTablet: boolean) => ({
  backgroundColor: color,
  color: '#FFF',
  border: 'none',
  borderRadius: '12px',
  width: isTablet ? '60px' : '50px',
  height: isTablet ? '60px' : '50px',
  fontSize: isTablet ? '24px' : '20px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 3px 5px rgba(0,0,0,0.3)',
});

const bigButtonStyle = (color: string, isTablet: boolean) => ({
  backgroundColor: color,
  color: '#FFF',
  border: '2px solid #FFF',
  borderRadius: '12px',
  padding: isTablet ? '15px 30px' : '12px 24px',
  fontSize: isTablet ? '18px' : '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 3px 5px rgba(0,0,0,0.3)',
  width: '100%',
});

export default GameUI;