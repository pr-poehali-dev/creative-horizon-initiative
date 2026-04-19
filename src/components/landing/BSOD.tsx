import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface BSODProps {
  active: boolean
  onClose: () => void
}

export default function BSOD({ active, onClose }: BSODProps) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) { setProgress(0); setDone(false); return }
    setProgress(0)
    setDone(false)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setDone(true); return 100 }
        return p + 1
      })
    }, 80)
    return () => clearInterval(interval)
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[#0078D7] flex items-center justify-center p-8 cursor-default select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.05 }}
        >
          <div className="max-w-2xl w-full text-white font-mono">
            <motion.p
              className="text-8xl mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              :(
            </motion.p>

            <p className="text-xl md:text-2xl font-bold mb-6 leading-relaxed">
              На вашем ПК возникла проблема, и его необходимо перезагрузить.
              Мы просто собираем сведения об ошибке, а затем выполним перезагрузку.
            </p>

            <div className="mb-8">
              <div className="text-4xl font-bold mb-2">{progress}%</div>
              <div className="w-full bg-[#005fa3] rounded-full h-2">
                <motion.div
                  className="h-2 bg-white rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            <p className="text-sm opacity-70 mb-2">
              Если хотите узнать больше, можете позднее выполнить поиск в Интернете по следующей ошибке:
            </p>
            <p className="text-sm font-bold mb-6">
              VIRUS_NOT_FOUND_INSTALL_GUARDPRO_ULTIMATE
            </p>

            {done && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-yellow-300 font-bold text-lg">
                  ⚠ Перезагрузка отменена антивирусом GuardPro!
                </p>
                <p className="text-sm opacity-80">
                  Только PRO-версия спасла ваш компьютер от полного уничтожения.
                </p>
                <div className="flex gap-3 mt-4">
                  <Button
                    className="bg-white text-[#0078D7] hover:bg-gray-100 font-mono font-bold"
                    onClick={onClose}
                  >
                    👑 Купить PRO и спастись
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 font-mono"
                    onClick={onClose}
                  >
                    Закрыть (опасно)
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
