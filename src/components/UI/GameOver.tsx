'use client'

interface GameOverProps {
  score: number;
  record: number;
  isNewRecord: boolean;
  onRetry: () => void;
  onMenu: () => void;
}

export default function GameOver({ score, record, isNewRecord, onRetry, onMenu }: GameOverProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'linear-gradient(to bottom, #2C3E50, #34495E)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}>
        <h1 style={{
          fontSize: '48px',
          color: '#E74C3C',
          marginBottom: '10px',
        }}>
          GAME OVER
        </h1>
        
        {isNewRecord && (
          <div style={{
            fontSize: '24px',
            color: '#F1C40F',
            marginBottom: '20px',
            animation: 'pulse 1.5s infinite',
          }}>
            🏆 NEW RECORD! 🏆
          </div>
        )}
        
        <div style={{ margin: '30px 0' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '18px', color: '#BDC3C7', marginBottom: '5px' }}>Your Score</p>
            <h2 style={{ fontSize: '64px', color: '#FFFFFF', margin: 0 }}>{score}</h2>
          </div>
          
          <div>
            <p style={{ fontSize: '18px', color: '#BDC3C7', marginBottom: '5px' }}>Best Score</p>
            <h2 style={{ fontSize: '48px', color: '#F1C40F', margin: 0 }}>{record}</h2>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onClick={onRetry}
            style={{
              background: 'linear-gradient(to bottom, #3498DB, #2980B9)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              minWidth: '150px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Try Again
          </button>
          
          <button
            onClick={onMenu}
            style={{
              background: 'linear-gradient(to bottom, #95A5A6, #7F8C8D)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              minWidth: '150px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(149, 165, 166, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}