import Game from '@/components/Game'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🎮 Swipe Brick Breaker
          </h1>
          <p className="text-gray-300 text-lg">
            Проведите от мяча чтобы задать траекторию и разрушить все кирпичи!
          </p>
        </div>
        
        <Game />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400">
          <div className="p-4 bg-gray-800/30 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-2">🎯 Как играть</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-blue-400 mr-2">1.</span>
                Нажмите на мяч и проведите в нужном направлении
              </li>
              <li className="flex items-center">
                <span className="text-blue-400 mr-2">2.</span>
                Отпустите чтобы запустить мяч
              </li>
              <li className="flex items-center">
                <span className="text-blue-400 mr-2">3.</span>
                Разрушайте кирпичи (у каждого несколько HP)
              </li>
              <li className="flex items-center">
                <span className="text-blue-400 mr-2">4.</span>
                Собирайте бонусы для дополнительных мячей
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-800/30 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-2">💎 Бонусы</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-500 mr-3 flex items-center justify-center text-white text-xs">+1</div>
                <span>Дополнительный мяч (максимум 5)</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-purple-500 mr-3 flex items-center justify-center text-white text-xs">▲</div>
                <span>Увеличение платформы на 10 сек</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-orange-500 mr-3 flex items-center justify-center text-white text-xs">⚡</div>
                <span>Увеличение скорости мячей</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Игра автоматически адаптируется под мобильные устройства и компьютеры</p>
          <p className="mt-1">Для управления используйте {typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'касания' : 'мышь'}</p>
        </div>
      </div>
    </main>
  )
}