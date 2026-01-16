import Game from '@/components/Game'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Brick Breaker
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Используйте мышь или касание для управления платформой
        </p>
        <Game />
        <div className="mt-8 text-gray-500 text-sm text-center">
          <p>Цель: разрушить все кирпичики</p>
          <p className="mt-2">Управление: перемещайте платформу влево/вправо</p>
        </div>
      </div>
    </main>
  )
}