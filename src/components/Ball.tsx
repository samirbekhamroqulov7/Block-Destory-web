import { BALL_SIZE } from '@/lib/gameUtils'

interface BallProps {
  x: number
  y: number
}

export default function Ball({ x, y }: BallProps) {
  return (
    <div className="absolute">
      <div 
        className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
        style={{
          width: `${BALL_SIZE}px`,
          height: `${BALL_SIZE}px`,
          transform: `translate(${x}px, ${y}px)`,
          position: 'fixed',
          left: 0,
          top: 0,
        }}
      />
    </div>
  )
}