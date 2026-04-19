import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface PanicModeProps {
  active: boolean
  onClose: () => void
}

const PANIC_MESSAGES = [
  '⚠ КРИТИЧЕСКАЯ УГРОЗА ОБНАРУЖЕНА',
  '☠ ВАШ ПК ВЗЛОМАН',
  '🔴 ХАКЕРЫ В СИСТЕМЕ',
  '💀 ДАННЫЕ УТЕКАЮТ',
  '🚨 НЕМЕДЛЕННО ПОЗВОНИТЕ: 8-800-GUARD-PRO',
  '☢ САМОУНИЧТОЖЕНИЕ ЧЕРЕЗ 10 СЕК',
  '👁 ВАС СМОТРЯТ ПРЯМО СЕЙЧАС',
  '⚡ ВИРУС РАЗМНОЖАЕТСЯ',
]

export default function PanicMode({ active, onClose }: PanicModeProps) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (!active) { setCountdown(10); return }

    const msgInterval = setInterval(() => {
      setMsgIndex(i => (i + 1) % PANIC_MESSAGES.length)
    }, 600)

    const cdInterval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(cdInterval); return 0 }
        return c - 1
      })
    }, 1000)

    return () => { clearInterval(msgInterval); clearInterval(cdInterval) }
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'black' }}
        >
          {/* мигающий красный фон */}
          <motion.div
            className="absolute inset-0"
            animate={{ backgroundColor: ['#1a0000', '#ff000033', '#1a0000'] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
          />

          {/* тряска всего контента */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-6"
            animate={{ x: [-4, 4, -4, 4, 0], y: [-2, 2, -2, 2, 0] }}
            transition={{ repeat: Infinity, duration: 0.15 }}
          >
            <motion.p
              className="text-8xl mb-6"
              animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              ☠
            </motion.p>

            <motion.h1
              className="font-mono font-black text-red-500 text-3xl md:text-5xl mb-4 uppercase tracking-widest"
              animate={{ color: ['#ef4444', '#ff0000', '#ef4444'] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            >
              ВАШ КОМПЬЮТЕР<br />ВЗЛОМАН!
            </motion.h1>

            <motion.p
              key={msgIndex}
              className="font-mono text-red-400 text-lg md:text-xl mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {PANIC_MESSAGES[msgIndex]}
            </motion.p>

            <div className="font-mono text-white text-sm mb-2 opacity-60">
              Самоуничтожение через:
            </div>
            <motion.div
              className="font-mono font-black text-6xl text-red-500 mb-8"
              animate={{ scale: countdown <= 3 ? [1, 1.3, 1] : 1 }}
              transition={{ repeat: countdown <= 3 ? Infinity : 0, duration: 0.4 }}
            >
              {countdown > 0 ? `0${countdown}`.slice(-2) : '💥'}
            </motion.div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-sm font-mono">
              <div className="bg-red-950/50 border border-red-700 rounded p-2 text-xs text-red-400 text-center">
                <p className="text-red-300 font-bold">Угроз</p>
                <p className="text-xl font-black text-red-500">∞</p>
              </div>
              <div className="bg-red-950/50 border border-red-700 rounded p-2 text-xs text-red-400 text-center">
                <p className="text-red-300 font-bold">Камера</p>
                <p className="text-xl font-black text-red-500">🔴 ВКЛ</p>
              </div>
            </div>

            <Button
              className="mt-8 bg-white hover:bg-gray-200 text-black font-mono font-bold px-8 py-4 text-base"
              onClick={onClose}
            >
              😱 СПАСИТЕ МОЙ ПК — Купить PRO
            </Button>

            <p className="text-gray-700 text-xs mt-3 font-mono">это шутка. всё хорошо 😄</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
