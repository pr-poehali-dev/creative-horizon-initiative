import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'

interface ProModalProps {
  open: boolean
  onClose: () => void
}

const PROCESSING_STEPS = [
  'Подключение к платёжной системе...',
  'Проверка номера телефона...',
  'Связь с банком...',
  'Запрос баланса счёта...',
  'Обнаружен кошелёк с деньгами...',
  'Оформление подписки на 99 лет...',
  'Списание средств... отменено (жалко)',
  'Активация Pro-версии...',
]

export default function ProModal({ open, onClose }: ProModalProps) {
  const [phase, setPhase] = useState<'form' | 'processing' | 'success'>('form')
  const [phone, setPhone] = useState('')
  const [progress, setProgress] = useState(0)
  const [logLines, setLogLines] = useState<string[]>([])

  const handleBuy = () => {
    if (!phone.trim()) return
    setPhase('processing')
    setProgress(0)
    setLogLines([])

    let step = 0
    const interval = setInterval(() => {
      step++
      const pct = Math.min(Math.round((step / PROCESSING_STEPS.length) * 100), 100)
      setProgress(pct)
      setLogLines(prev => [...prev, PROCESSING_STEPS[step - 1] || ''])

      if (step >= PROCESSING_STEPS.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('success'), 600)
      }
    }, 400)
  }

  const handleClose = () => {
    setPhase('form')
    setPhone('')
    setProgress(0)
    setLogLines([])
    onClose()
  }

  const maskedPhone = phone.slice(0, 3) + '***' + phone.slice(-2)

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
            className="relative w-full max-w-lg mx-4 bg-black border border-yellow-500 rounded-lg p-6 font-mono shadow-[0_0_40px_#eab30833]"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-yellow-500 hover:text-white transition-colors"
              onClick={handleClose}
            >
              <Icon name="X" size={18} />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#00FF41] inline-block" />
              <span className="ml-2 text-yellow-400 text-xs tracking-widest uppercase">GuardPro — Оформление подписки</span>
            </div>

            {phase === 'form' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-5">
                  <p className="text-4xl mb-2">👑</p>
                  <p className="text-yellow-400 font-bold text-xl uppercase tracking-widest">GuardPro ULTIMATE</p>
                  <p className="text-green-400 text-sm mt-1">Защита от всех угроз во вселенной</p>
                </div>

                <div className="bg-yellow-950/20 border border-yellow-800 rounded p-3 mb-4 space-y-1 text-xs text-yellow-300">
                  <p>✓ Удаление 999 999 вирусов в секунду</p>
                  <p>✓ Защита от инопланетных хакеров</p>
                  <p>✓ Охрана холодильника от троянов</p>
                  <p>✓ Личный телохранитель (виртуальный)</p>
                  <p>✓ Бесплатная пицца (не входит в стоимость)</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 line-through text-sm">9 999 ₽/мес</span>
                  <span className="text-yellow-400 font-bold text-2xl">199 ₽/мес</span>
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded animate-pulse">-98%</span>
                </div>

                <p className="text-[#00FF41] text-sm mb-2">{'>'} Введите номер телефона для активации:</p>
                <Input
                  className="bg-black border-yellow-500 text-yellow-400 placeholder:text-yellow-900 font-mono focus-visible:ring-yellow-500 mb-4"
                  placeholder="+7 (999) 000-00-00"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleBuy()}
                  autoFocus
                />
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-bold text-lg"
                  onClick={handleBuy}
                  disabled={!phone.trim()}
                >
                  💳 КУПИТЬ PRO — 199 ₽
                </Button>
                <p className="text-gray-600 text-xs text-center mt-2">Нажимая кнопку, вы соглашаетесь с тем, что вас обманули</p>
              </motion.div>
            )}

            {phase === 'processing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-yellow-400 text-sm mb-3">{'>'} Обработка платежа для: <span className="font-bold">{maskedPhone}</span></p>
                <div className="h-2 w-full bg-yellow-950 rounded mb-3">
                  <motion.div
                    className="h-2 bg-yellow-500 rounded"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-yellow-400 text-xs mb-3 text-right">{progress}%</p>
                <div className="bg-black border border-yellow-900 rounded p-3 h-44 overflow-y-auto space-y-1">
                  {logLines.map((line, i) => (
                    <p key={i} className="text-yellow-400 text-xs">{'>'} {line}</p>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'success' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center mb-4">
                  <motion.p
                    className="text-5xl mb-3"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    🎉
                  </motion.p>
                  <p className="text-yellow-400 font-bold text-lg uppercase tracking-widest">Поздравляем!</p>
                  <p className="text-white text-sm mt-1">GuardPro Ultimate активирован</p>
                </div>
                <div className="bg-yellow-950/30 border border-yellow-700 rounded p-3 text-xs text-yellow-400 space-y-1 mb-4">
                  <p>{'>'} Номер: <span className="font-bold">{maskedPhone}</span></p>
                  <p>{'>'} Статус: <span className="text-[#00FF41] font-bold">АКТИВНО (наверное)</span></p>
                  <p>{'>'} Деньги списаны: <span className="text-[#00FF41] font-bold">нет (это фейк 😄)</span></p>
                  <p>{'>'} Вирусов удалено: <span className="font-bold">все, включая кота.jpg</span></p>
                </div>
                <Button
                  className="w-full bg-[#00FF41] hover:bg-green-300 text-black font-mono font-bold"
                  onClick={handleClose}
                >
                  ✅ Отлично, закрыть
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
