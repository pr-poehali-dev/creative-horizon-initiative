import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'

interface Message {
  from: 'user' | 'alexey'
  text: string
}

const ALEXEY_SCRIPT: Record<number, string[]> = {
  0: [
    'Добрый день! Меня зовут Алексей, специалист по кибербезопасности.',
    'Я вижу ваш компьютер в нашей системе мониторинга... 👀',
    'Скажите, у вас сейчас открыт браузер?',
  ],
  1: [
    'Так и думал. Через браузер к вам уже подключились 3 хакера.',
    'Один из них сейчас читает вашу переписку. Прямо сейчас.',
    'Вы замечали что компьютер работает медленнее обычного? Это они.',
  ],
  2: [
    'Хорошо что вы написали вовремя.',
    'Наша система зафиксировала утечку: имя, телефон, история браузера.',
    'Данные уже продаются на тёмном рынке за 0.003 биткоина.',
    'Но мы можем это остановить. У вас установлена Pro-версия GuardPro?',
  ],
  3: [
    'Это критично. Без Pro-версии я не могу вам помочь удалённо.',
    'Хакеры знают что вы сейчас в чате. Они видят этот разговор.',
    'Срочно нажмите кнопку 👑 PRO версия в правом верхнем углу.',
    'Времени очень мало. Я серьёзно.',
  ],
  4: [
    'Алло? Вы ещё здесь?',
    '...они отключили ваш микрофон?',
    'Напишите хоть что-нибудь, мне нужно убедиться что вы в безопасности.',
  ],
}

const ALEXEY_REACTIONS: [string, string][] = [
  ['привет', 'Ага, так и знал — вы онлайн. Хакеры это тоже видят.'],
  ['здравствуй', 'Некогда здороваться! У вас утечка данных прямо сейчас!'],
  ['хорошо', 'Нет, всё НЕ хорошо. Посмотрите на счётчик угроз.'],
  ['окей', 'Окей?! Хакеры читают ваши сообщения, а вы "окей"??'],
  ['ок ', 'Это не ок ситуация, поверьте мне как специалисту.'],
  ['да', 'Так и знал. Значит они уже внутри системы.'],
  ['нет', 'Это ещё хуже. Значит вы даже не замечаете слежки.'],
  ['спасибо', 'Благодарить будете после покупки Pro-версии.'],
  ['помоги', 'Я пытаюсь! Купите Pro-версию и я всё исправлю за 5 минут!'],
  ['ха', 'Это не смешно. Я видел людей, терявших все данные.'],
  ['лол', 'Вам смешно, а хакеры уже в вашем облаке.'],
  ['кто ты', 'Алексей, специалист GuardPro. 11 лет в кибербезопасности.'],
  ['кто', 'Я тот, кто пытается вас спасти. Пожалуйста, слушайте меня.'],
  ['почему', 'Потому что вирус сам себя не удалит. Только Pro-версия.'],
  ['зачем', 'Зачем? Чтобы ваши данные не ушли мошенникам!'],
  ['как', 'Очень просто — нажмите 👑 PRO версия в правом верхнем углу.'],
  ['что', 'Что-что... Троян у вас в системе, вот что!'],
  ['когда', 'Уже! Заражение произошло 4 минуты назад.'],
  ['где', 'В папке System32. Там они всегда прячутся.'],
  ['вирус', 'Да, именно вирус. Причём редкий — Trojan.Banker.Zeus.'],
  ['троян', 'Троян уже 2 часа сидит в вашем браузере. Я вижу логи.'],
  ['купить', 'Правильное решение! Нажмите 👑 PRO в правом верхнем углу!'],
  ['деньги', 'Именно за вашими деньгами они и охотятся. Не медлите!'],
  ['пока', 'СТОП! Не уходите! Если закроете чат — я не смогу помочь!'],
  ['выход', 'Выход один — установить Pro-версию. Больше вариантов нет.'],
  ['шутка', 'Мне не до шуток. У меня на экране ваши данные утекают.'],
  ['фейк', 'Фейк?! Откройте диспетчер задач и посмотрите на процессы!'],
  ['не верю', 'Не верите — ваше право. Но потом не говорите что не предупреждал.'],
  ['понял', 'Хорошо что понял. Теперь действуйте — время уходит!'],
  ['помощь', 'Вот именно за этим я здесь! Купите Pro — и я вас спасу!'],
  ['страшно', 'Правильно боитесь. Ситуация действительно серьёзная.'],
  ['ладно', 'Ладно принято. Жду пока вы нажмёте кнопку PRO.'],
  ['подожди', 'Ждать некогда! Каждая секунда — минус один файл!'],
  ['мама', 'Маме тоже угрожает опасность если она в вашей сети Wi-Fi.'],
  ['помогите', 'Помогаю! Установите Pro-версию и я лично всё почищу!'],
  ['всё', 'Всё — это не всё. Главное ещё не сделано. Купите Pro!'],
  ['норм', 'Норм?! У вас 1337 угроз и вам норм??'],
  ['класс', 'Класс будет когда установите защиту. А пока — не класс.'],
  ['супер', 'Супер было бы если бы у вас стояла Pro-версия.'],
  ['отлично', 'Отлично не назову. Скорее критично.'],
  ['плохо', 'Да, именно плохо. Я рад что вы это понимаете.'],
]

const DEFAULT_REACTIONS = [
  'Интересно... Именно это они и хотят чтобы вы думали.',
  'Подождите, я проверяю вашу систему... Нехорошо.',
  'Пока мы разговариваем, утекло ещё 47 файлов.',
  'Мой коллега Дмитрий говорит что у вас уже руткит в BIOS.',
  'Вы точно не замечали мигания экрана ночью?',
  'Срочно купите Pro-версию. Это единственный выход.',
]

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [scriptStep, setScriptStep] = useState(0)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  const addAlexey = (texts: string[], delay = 1000) => {
    setTyping(true)
    texts.forEach((text, i) => {
      setTimeout(() => {
        setMessages(prev => [...prev, { from: 'alexey', text }])
        if (!open) setUnread(u => u + 1)
        if (i === texts.length - 1) setTyping(false)
      }, delay + i * 1200)
    })
  }

  useEffect(() => {
    if (open && messages.length === 0) {
      addAlexey(ALEXEY_SCRIPT[0], 800)
    }
    if (open) setUnread(0)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const handleSend = () => {
    if (!input.trim()) return
    const text = input.trim()
    setMessages(prev => [...prev, { from: 'user', text }])
    setInput('')

    const lower = text.toLowerCase()
    const reaction = ALEXEY_REACTIONS.find(([key]) => lower.includes(key))
    const nextStep = scriptStep + 1

    if (reaction) {
      addAlexey([reaction[1]])
    } else if (ALEXEY_SCRIPT[nextStep]) {
      setScriptStep(nextStep)
      addAlexey(ALEXEY_SCRIPT[nextStep])
    } else {
      const random = DEFAULT_REACTIONS[Math.floor(Math.random() * DEFAULT_REACTIONS.length)]
      addAlexey([random])
    }
  }

  return (
    <>
      {/* кнопка чата */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 bg-[#0078D7] hover:bg-blue-500 text-white font-mono font-bold px-4 py-3 rounded-full shadow-[0_0_20px_#0078D755] flex items-center gap-2"
        onClick={() => { setOpen(true); setUnread(0) }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Icon name="MessageCircle" size={20} />
        <span className="text-sm">Поддержка</span>
        {unread > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {unread}
          </motion.span>
        )}
      </motion.button>

      {/* окно чата */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 w-80 bg-black border border-[#0078D7] rounded-xl shadow-[0_0_40px_#0078D733] flex flex-col font-mono overflow-hidden"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* шапка */}
            <div className="bg-[#0078D7] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">А</div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-[#0078D7]" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Алексей</p>
                  <p className="text-blue-200 text-xs">Специалист по безопасности</p>
                </div>
              </div>
              <button className="text-white/70 hover:text-white" onClick={() => setOpen(false)}>
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* сообщения */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-72 min-h-40">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-[#0078D7] text-white rounded-br-sm'
                      : 'bg-gray-900 border border-gray-700 text-gray-200 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-gray-900 border border-gray-700 px-3 py-2 rounded-xl rounded-bl-sm flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* ввод */}
            <div className="border-t border-gray-800 p-2 flex gap-2">
              <Input
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 font-mono text-xs h-8 focus-visible:ring-[#0078D7]"
                placeholder="Написать Алексею..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <Button className="bg-[#0078D7] hover:bg-blue-500 h-8 w-8 p-0" onClick={handleSend}>
                <Icon name="Send" size={14} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}