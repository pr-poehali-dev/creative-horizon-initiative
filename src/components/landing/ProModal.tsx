import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'

interface ProModalProps {
  open: boolean
  onClose: () => void
}

const PAYMENT_STEPS = [
  'Подключение к платёжной системе...',
  'Проверка номера телефона...',
  'Связь с банком...',
  'Запрос баланса счёта...',
  'Обнаружен кошелёк с деньгами...',
  'Оформление подписки на 99 лет...',
  'Списание средств... отменено (жалко)',
  'Активация Pro-версии...',
]

const MEGA_SCAN_STEPS = [
  'Инициализация МЕГА-СКАНЕРА v9000...',
  'Сканирование оперативной памяти...',
  'Анализ жёсткого диска (все 47 ТБ)...',
  'Проверка холодильника по Wi-Fi...',
  'Сканирование соседского роутера...',
  'Перехват сигналов с МКС...',
  'Анализ облачных серверов NASA...',
  'Обнаружен вирус в Антарктиде...',
  'Нейтрализация угрозы из параллельного измерения...',
  'Очистка квантового пространства...',
  'Сканирование завершено. Всё чисто. Наверное.',
]

const DELETE_STEPS = [
  'Активация режима ЯДЕРНОЙ ОЧИСТКИ...',
  'Уничтожение: Trojan.exe ☠',
  'Уничтожение: Spy_agent_007.dll ☠',
  'Уничтожение: CryptoMiner_hidden.sys ☠',
  'Уничтожение: кот.jpg (подозрительный) ☠',
  'Уничтожение: реклама во всех браузерах ☠',
  'Уничтожение: 1 328 безымянных угроз ☠',
  'Финальный удар: ВСЁУДАЛЕНО.bat ☠',
  'Перезагрузка матрицы...',
  '✅ Компьютер полностью очищен!',
]

type Phase = 'form' | 'paying' | 'dashboard' | 'megascan' | 'deleting' | 'done'

export default function ProModal({ open, onClose }: ProModalProps) {
  const [phase, setPhase] = useState<Phase>('form')
  const [phone, setPhone] = useState('')
  const [progress, setProgress] = useState(0)
  const [logLines, setLogLines] = useState<string[]>([])
  const [viruses, setViruses] = useState(1337)

  const runSteps = (steps: string[], onDone: () => void, speed = 400) => {
    setProgress(0)
    setLogLines([])
    let step = 0
    const interval = setInterval(() => {
      step++
      const pct = Math.min(Math.round((step / steps.length) * 100), 100)
      setProgress(pct)
      setLogLines(prev => [...prev, steps[step - 1] || ''])
      if (step >= steps.length) {
        clearInterval(interval)
        setTimeout(onDone, 600)
      }
    }, speed)
  }

  const handleBuy = () => {
    if (!phone.trim()) return
    setPhase('paying')
    runSteps(PAYMENT_STEPS, () => setPhase('dashboard'))
  }

  const handleMegaScan = () => {
    setPhase('megascan')
    setViruses(Math.floor(Math.random() * 5000) + 10000)
    runSteps(MEGA_SCAN_STEPS, () => setPhase('dashboard'), 300)
  }

  const handleDeleteAll = () => {
    setPhase('deleting')
    runSteps(DELETE_STEPS, () => { setViruses(0); setPhase('done') }, 350)
  }

  const handleClose = () => {
    setPhase('form')
    setPhone('')
    setProgress(0)
    setLogLines([])
    setViruses(1337)
    onClose()
  }

  const maskedPhone = phone.length > 5 ? phone.slice(0, 3) + '***' + phone.slice(-2) : phone

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
            <button className="absolute top-3 right-4 text-yellow-500 hover:text-white transition-colors" onClick={handleClose}>
              <Icon name="X" size={18} />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#00FF41] inline-block" />
              <span className="ml-2 text-yellow-400 text-xs tracking-widest uppercase">
                {phase === 'dashboard' || phase === 'done' ? 'GuardPro ULTIMATE — Панель управления' : 'GuardPro — Оформление подписки'}
              </span>
            </div>

            {/* ФОРМА ПОКУПКИ */}
            {phase === 'form' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-5">
                  <p className="text-4xl mb-2">👑</p>
                  <p className="text-yellow-400 font-bold text-xl uppercase tracking-widest">GuardPro ULTIMATE</p>
                  <p className="text-green-400 text-sm mt-1">Защита от всех угроз во вселенной</p>
                </div>
                <div className="bg-yellow-950/20 border border-yellow-800 rounded p-3 mb-4 space-y-1 text-xs text-yellow-300">
                  <p>✓ Мега-сканирование всего и вся</p>
                  <p>✓ Кнопка «Удалить ВСЕ вирусы» одним кликом</p>
                  <p>✓ Защита от инопланетных хакеров</p>
                  <p>✓ Охрана холодильника от троянов</p>
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
                <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-bold text-lg" onClick={handleBuy} disabled={!phone.trim()}>
                  💳 КУПИТЬ PRO — 199 ₽
                </Button>
                <p className="text-gray-600 text-xs text-center mt-2">Нажимая кнопку, вы соглашаетесь с тем, что вас обманули</p>
              </motion.div>
            )}

            {/* ОПЛАТА / СКАНИРОВАНИЕ / УДАЛЕНИЕ — лог */}
            {(phase === 'paying' || phase === 'megascan' || phase === 'deleting') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-yellow-400 text-sm mb-3">
                  {phase === 'paying' && <>{'>'} Обработка платежа: <span className="font-bold">{maskedPhone}</span></>}
                  {phase === 'megascan' && <>{'>'} <span className="text-[#00FF41] font-bold">МЕГА-СКАНИРОВАНИЕ</span> запущено...</>}
                  {phase === 'deleting' && <>{'>'} <span className="text-red-400 font-bold">ЯДЕРНАЯ ОЧИСТКА</span> активирована...</>}
                </p>
                <div className="h-2 w-full bg-yellow-950 rounded mb-3">
                  <motion.div
                    className={`h-2 rounded ${phase === 'deleting' ? 'bg-red-500' : phase === 'megascan' ? 'bg-[#00FF41]' : 'bg-yellow-500'}`}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-yellow-400 text-xs mb-3 text-right">{progress}%</p>
                <div className="bg-black border border-yellow-900 rounded p-3 h-44 overflow-y-auto space-y-1">
                  {logLines.map((line, i) => (
                    <p key={i} className={`text-xs ${phase === 'deleting' ? 'text-red-400' : phase === 'megascan' ? 'text-[#00FF41]' : 'text-yellow-400'}`}>{'>'} {line}</p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PRO ПАНЕЛЬ */}
            {phase === 'dashboard' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4 bg-yellow-950/20 border border-yellow-800 rounded p-3">
                  <div>
                    <p className="text-yellow-400 text-xs uppercase tracking-widest">Статус</p>
                    <p className="text-[#00FF41] font-bold">👑 PRO АКТИВЕН</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 text-xs uppercase tracking-widest">Угроз обнаружено</p>
                    <p className="text-red-400 font-bold text-xl">{viruses.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-full bg-[#00FF41] hover:bg-green-300 text-black font-mono font-bold text-base py-5"
                      onClick={handleMegaScan}
                    >
                      🔬 МЕГА-СКАНИРОВАНИЕ
                    </Button>
                    <p className="text-green-900 text-xs text-center mt-1">Сканирует всё — включая холодильник и МКС</p>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-base py-5"
                      onClick={handleDeleteAll}
                    >
                      ☢ УДАЛИТЬ ВСЕ ВИРУСЫ
                    </Button>
                    <p className="text-red-900 text-xs text-center mt-1">Необратимое действие. Ядерный режим.</p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ВСЁУДАЛЕНО */}
            {phase === 'done' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center mb-4">
                  <motion.p
                    className="text-6xl mb-3"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: 2, duration: 0.5 }}
                  >
                    💥
                  </motion.p>
                  <p className="text-[#00FF41] font-bold text-xl uppercase tracking-widest">ВСЕ ВИРУСЫ УНИЧТОЖЕНЫ</p>
                  <p className="text-white text-sm mt-1">Ваш компьютер теперь чище, чем совесть</p>
                </div>
                <div className="bg-green-950/30 border border-green-800 rounded p-3 text-xs text-green-400 space-y-1 mb-4">
                  <p>{'>'} Угроз уничтожено: <span className="text-[#00FF41] font-bold">{viruses === 0 ? '1 337' : viruses.toLocaleString()}</span></p>
                  <p>{'>'} Холодильник: <span className="text-[#00FF41] font-bold">чист</span></p>
                  <p>{'>'} МКС: <span className="text-[#00FF41] font-bold">под защитой</span></p>
                  <p>{'>'} кот.jpg: <span className="text-red-400 font-bold">уничтожен (RIP)</span></p>
                </div>
                <Button className="w-full bg-[#00FF41] hover:bg-green-300 text-black font-mono font-bold" onClick={handleClose}>
                  ✅ Закрыть и отдохнуть
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
