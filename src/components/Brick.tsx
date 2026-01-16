interface BrickProps {
  x: number
  y: number
  width: number
  height: number
}

export default function Brick({ x, y, width, height }: BrickProps) {
  return (
    <div className="absolute">
      <div 
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded shadow-lg border border-emerald-700"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${x}px, ${y}px)`,
          position: 'fixed',
          left: 0,
          top: 0,
        }}
      />
    </div>
  )
}