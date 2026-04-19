import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Section from './Section'
import Layout from './Layout'
import { sections } from './sections'
import ScanModal from './ScanModal'
import ProModal from './ProModal'

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [proOpen, setProOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 59)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => t > 0 ? t - 1 : 9 * 60 + 59)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop
        const windowHeight = window.innerHeight
        const newActiveSection = Math.floor(scrollPosition / windowHeight)
        setActiveSection(newActiveSection)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const handleNavClick = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <Layout>
      <nav className="fixed top-0 right-0 h-screen flex flex-col justify-center z-30 p-4">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`w-3 h-3 rounded-full my-2 transition-all ${
              index === activeSection ? 'bg-white scale-150' : 'bg-gray-600'
            }`}
            onClick={() => handleNavClick(index)}
          />
        ))}
      </nav>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-white origin-left z-30"
        style={{ scaleX }}
      />
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
      >
        {sections.map((section, index) => (
          <Section
            key={section.id}
            {...section}
            isActive={index === activeSection}
            onButtonClick={section.showButton ? () => setModalOpen(true) : undefined}
          />
        ))}
      </div>
      <motion.button
        className="fixed top-4 right-4 z-40 bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-bold rounded-lg shadow-[0_0_30px_#eab308aa] flex flex-col items-center px-5 py-2"
        onClick={() => setProOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={timeLeft <= 30 ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <span className="text-base">👑 PRO версия</span>
        <span className={`text-xs font-mono mt-0.5 ${timeLeft <= 60 ? 'text-red-700' : 'text-black/70'}`}>
          🔥 Осталось {mins}:{secs}
        </span>
      </motion.button>
      <ScanModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <ProModal open={proOpen} onClose={() => setProOpen(false)} />
    </Layout>
  )
}