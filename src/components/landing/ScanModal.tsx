import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'

interface ScanModalProps {
  open: boolean
  onClose: () => void
}

const FAKE_RESULTS = [
  'Подключение к серверам ФСБ...',
  'Анализ cookies и истории браузера...',
  'Сканирование папки «Загрузки»...',
  'Обнаружен подозрительный файл: кот.jpg',
  'Проверка камеры и микрофона...',
  'Чтение переписки в Telegram...',
  'Доступ к банковским данным...',
  'Финальный анализ угроз...',
]

export default function ScanModal({ open, onClose }: ScanModalProps) {
  const [threat, setThreat] = useState('')
  const [phase, setPhase] = useState<'input' | 'scanning' | 'result'>('input')
  const [progress, setProgress] = useState(0)
  const [logLines, setLogLines] = useState<string[]>([])

  const isEasterEgg = threat.trim().toLowerCase() === 'юра'

  const handleScan = () => {
    if (!threat.trim()) return
    setPhase('scanning')
    setProgress(0)
    setLogLines([])

    const logs = isEasterEgg ? [
      'Инициализация сканирования...',
      'СТОП. ЧТО ЭТО?',
      'Обнаружен НЕИЗВЕСТНЫЙ ОБЪЕКТ...',
      'Классификация: ЧЕЛОВЕК? АСТРОНАВТ? БОГ?',
      'Попытка удалить... ОТКАЗАНО.',
      'Попытка заблокировать... ОТКАЗАНО.',
      'ИИ-щит отключился добровольно.',
      'Антивирус складывает полномочия. Удачи.',
    ] : FAKE_RESULTS

    let step = 0
    const interval = setInterval(() => {
      step++
      const pct = Math.min(Math.round((step / logs.length) * 100), 100)
      setProgress(pct)
      setLogLines(prev => [...prev, logs[step - 1] || ''])

      if (step >= logs.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('result'), 600)
      }
    }, 350)
  }

  const handleClose = () => {
    setPhase('input')
    setThreat('')
    setProgress(0)
    setLogLines([])
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-lg mx-4 bg-black border border-[#00FF41] rounded-lg p-6 font-mono shadow-[0_0_40px_#00FF4133]"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-[#00FF41] hover:text-white transition-colors"
              onClick={handleClose}
            >
              <Icon name="X" size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#00FF41] inline-block" />
              <span className="ml-2 text-[#00FF41] text-xs tracking-widest uppercase">GuardPro v4.2 — Сканер угроз</span>
            </div>

            {phase === 'input' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-[#00FF41] text-sm mb-2">{'>'} Введите название угрозы для сканирования:</p>
                <Input
                  className="bg-black border-[#00FF41] text-[#00FF41] placeholder:text-green-900 font-mono focus-visible:ring-[#00FF41] mb-4"
                  placeholder="например: троян, вирус, шпион..."
                  value={threat}
                  onChange={e => setThreat(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                  autoFocus
                />
                <Button
                  className="w-full bg-[#00FF41] text-black hover:bg-green-300 font-mono font-bold"
                  onClick={handleScan}
                  disabled={!threat.trim()}
                >
                  🛡 ЗАПУСТИТЬ СКАНИРОВАНИЕ
                </Button>
              </motion.div>
            )}

            {phase === 'scanning' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-[#00FF41] text-sm mb-3">{'>'} Сканирование: <span className="font-bold">{threat.toUpperCase()}</span></p>
                <div className="h-2 w-full bg-green-950 rounded mb-3">
                  <motion.div
                    className="h-2 bg-[#00FF41] rounded"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-[#00FF41] text-xs mb-3 text-right">{progress}%</p>
                <div className="bg-black border border-green-900 rounded p-3 h-40 overflow-y-auto space-y-1">
                  {logLines.map((line, i) => (
                    <p key={i} className="text-green-400 text-xs">{'>'} {line}</p>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'result' && !isEasterEgg && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center mb-4">
                  <p className="text-red-500 text-4xl mb-2">☠</p>
                  <p className="text-[#00FF41] font-bold text-lg uppercase tracking-widest">Угроза обнаружена!</p>
                  <p className="text-red-400 font-bold text-xl mt-1">{threat.toUpperCase()}</p>
                </div>
                <div className="bg-green-950/30 border border-green-800 rounded p-3 text-xs text-green-400 space-y-1 mb-4">
                  <p>{'>'} Угроз найдено: <span className="text-red-400 font-bold">1 337</span></p>
                  <p>{'>'} Заражённых файлов: <span className="text-red-400 font-bold">42</span></p>
                  <p>{'>'} Утечек данных: <span className="text-red-400 font-bold">обнаружено</span></p>
                  <p>{'>'} Статус: <span className="text-red-400 font-bold animate-pulse">⚠ КРИТИЧЕСКАЯ ОПАСНОСТЬ</span></p>
                </div>
                <Button
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold"
                  onClick={handleClose}
                >
                  🔥 УДАЛИТЬ {threat.toUpperCase()} — Pro версия
                </Button>
              </motion.div>
            )}

            {phase === 'result' && isEasterEgg && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center mb-4">
                  <motion.p
                    className="text-5xl mb-3"
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    👨‍🚀
                  </motion.p>
                  <p className="text-yellow-400 font-bold text-lg uppercase tracking-widest">УГРОЗА НЕУСТРАНИМА</p>
                  <p className="text-white font-bold text-xl mt-1">ЭТО ЮРА</p>
                </div>
                <div className="bg-yellow-950/30 border border-yellow-700 rounded p-3 text-xs text-yellow-400 space-y-1 mb-4">
                  <p>{'>'} Уровень угрозы: <span className="text-yellow-300 font-bold">КОСМИЧЕСКИЙ</span></p>
                  <p>{'>'} Попыток удалить: <span className="font-bold">∞</span></p>
                  <p>{'>'} Результат: <span className="font-bold">ПРОВАЛ</span></p>
                  <p>{'>'} Статус антивируса: <span className="text-red-400 font-bold animate-pulse">уволился</span></p>
                </div>
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-bold"
                  onClick={handleClose}
                >
                  🚀 Сдаться и закрыть
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}