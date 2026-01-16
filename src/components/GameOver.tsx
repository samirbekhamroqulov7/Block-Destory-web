interface GameOverProps {
  score: number
  onRestart: () => void
  isWin: boolean
}

export default function GameOver({ score, onRestart, isWin }: GameOverProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">
          {isWin ? '🎉 Победа! 🎉' : '💀 Конец игры'}
        </h2>
        
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-yellow-400 my-4">{score}</div>
          <p className="text-gray-300 text-xl">Ваш счёт</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
          >
            Играть снова
          </button>
          
          <div className="text-center text-gray-400 text-sm pt-4">
            <p>Используйте мышь или касание для управления</p>
            <p className="mt-1">Разрушите все кирпичики!</p>
          </div>
        </div>
      </div>
    </div>
  )
}