'use client'

interface HeaderProps {
  record: number;
  score: number;
  level: number;
  ballsCount: number;
  onMenuClick: () => void;
}

export default function Header({ record, score, level, ballsCount, onMenuClick }: HeaderProps) {
  return (
    <div style={{
      height: '80px',
      background: 'linear-gradient(to bottom, #D0E8F2, #E8F4F8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#7F8C8D', fontWeight: 'bold' }}>RECORD</div>
          <div style={{ fontSize: '48px', color: '#FF9500', fontWeight: 'bold', lineHeight: 1 }}>{record}</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#7F8C8D', fontWeight: 'bold' }}>SCORE</div>
          <div style={{ fontSize: '36px', color: '#5DADE2', fontWeight: 'bold', lineHeight: 1 }}>{score}</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#7F8C8D', fontWeight: 'bold' }}>LEVEL</div>
          <div style={{ fontSize: '24px', color: '#2C3E50', fontWeight: 'bold', lineHeight: 1 }}>{level}</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#7F8C8D', fontWeight: 'bold' }}>BALLS</div>
          <div style={{ fontSize: '24px', color: '#2C3E50', fontWeight: 'bold', lineHeight: 1 }}>{ballsCount}</div>
        </div>
        
        <button
          onClick={onMenuClick}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '32px',
            color: '#5DADE2',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(93, 173, 226, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          ☰
        </button>
      </div>
    </div>
  );
}