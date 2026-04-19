import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const THREATS = [
  'Trojan.Win32.Agent.xyz',
  'Spyware.KeyLogger.Pro',
  'Backdoor.IRC.Bot.v2',
  'Worm.Email.Mydoom.b',
  'Rootkit.Hidden.Sys32',
  'Ransomware.Crypt.Lock',
  'Adware.BrowserHijack',
  'Virus.Boot.Sector.MBR',
  'Trojan.Banker.Zeus.v3',
  'Spyware.CamSpy.Silent',
]

interface Toast {
  id: number
  threat: string
}

export default function ThreatToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const threat = THREATS[Math.floor(Math.random() * THREATS.length)]
      const id = Date.now()
      setToasts(prev => [...prev, { id, threat }])
      setCounter(c => c + 1)
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 6000)
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-xs">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            className="bg-black border border-red-600 rounded-lg p-3 font-mono shadow-[0_0_20px_#dc262655]"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <div className="flex items-start gap-2">
              <motion.span
                className="text-red-500 text-lg mt-0.5"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                ⚠
              </motion.span>
              <div>
                <p className="text-red-400 text-xs font-bold uppercase tracking-wider">Угроза обнаружена!</p>
                <p className="text-white text-xs mt-0.5">{toast.threat}</p>
                <p className="text-gray-500 text-xs mt-1">GuardPro заблокировал угрозу #{counter}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
