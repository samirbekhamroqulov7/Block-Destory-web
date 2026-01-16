import { PADDLE_WIDTH, PADDLE_HEIGHT } from '@/lib/gameUtils'

interface PaddleProps {
  x: number
}

export default function Paddle({ x }: PaddleProps) {
  return (
    <div className="absolute">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg"
        style={{
          width: `${PADDLE_WIDTH}px`,
          height: `${PADDLE_HEIGHT}px`,
          transform: `translate(${x}px, calc(100vh - 100px))`,
          position: 'fixed',
          left: 0,
          top: 0,
        }}
      />
    </div>
  )
}