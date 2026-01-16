import Game from '@/components/Game'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            🎮 Block Destroy
          </h1>
          <p className="text-gray-600 text-lg">
            Aim & Shoot Brick Breaker with Special Blocks
          </p>
        </div>
        
        <Game />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          <div className="p-4 bg-white/50 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-3 text-blue-600">🎯 How to Play</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">1.</span>
                Click and drag from the launcher to aim
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">2.</span>
                Release to shoot multiple balls
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">3.</span>
                Destroy blocks with different layers
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">4.</span>
                After all balls return, blocks move down
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">5.</span>
                Prevent blocks from reaching the red line!
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-white/50 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-3 text-green-600">💎 Special Blocks</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-red-500 mr-3 flex items-center justify-center text-white">💣</div>
                <span><strong>Bomb:</strong> Explodes in 5×5 radius</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 mr-3 flex items-center justify-center text-white">↕️</div>
                <span><strong>Vertical Laser:</strong> Destroys entire column</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-yellow-500 mr-3 flex items-center justify-center text-white">↔️</div>
                <span><strong>Horizontal Laser:</strong> Destroys entire row</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-purple-500 mr-3 flex items-center justify-center text-white">✖️</div>
                <span><strong>Diagonal Laser:</strong> Destroys both diagonals</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white/50 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-3 text-red-600">🎨 Color System</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded mr-2" style={{ background: '#FFB3BA' }}></div>
                <span>Layers 1-10: Red gradient</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded mr-2" style={{ background: '#BAFFB3' }}></div>
                <span>Layers 11-20: Green gradient</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded mr-2" style={{ background: '#B3D9FF' }}></div>
                <span>Layers 21-30: Blue gradient</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded mr-2" style={{ background: '#FFFFB3' }}></div>
                <span>Layers 31-40: Yellow-Orange</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded mr-2" style={{ background: '#E6B3FF' }}></div>
                <span>Layers 41-50: Purple gradient</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Game automatically adapts to mobile and desktop devices</p>
          <p className="mt-1">For controls use {typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'touch' : 'mouse'}</p>
        </div>
      </div>
    </main>
  )
}