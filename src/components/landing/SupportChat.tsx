import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'

interface Message {
  from: 'user' | 'alexey'
  text: string
}

const ALEXEY_REPLIES: [string[], string][] = [
  [['привет', 'здравствуй', 'хай', 'хей', 'hello', 'hi'], 'Привет! Хорошо что написали. Ваш ПК в опасности, я вижу активные угрозы прямо сейчас.'],
  [['пока', 'до свидания', 'bye', 'выхожу'], 'СТОП! Не уходите! Если закроете чат — хакеры получат полный доступ!'],
  [['вирус', 'заражён', 'заражен', 'заразился'], 'Да, вижу. Trojan.Banker.Zeus + ещё 2 руткита. Это серьёзно. Только Pro-версия спасёт.'],
  [['троян', 'trojan'], 'Троян уже 2 часа в вашем браузере. Он перехватывает пароли. Нужна срочная очистка.'],
  [['шпион', 'слежка', 'следят'], 'Да, за вами следят. Камера и микрофон активны без вашего ведома. Это я вижу в логах.'],
  [['помоги', 'помогите', 'помощь', 'спаси', 'спасите'], 'Пытаюсь! Но без Pro-версии мои руки связаны. Нажмите 👑 PRO в правом верхнем углу — и я всё почищу за 5 минут.'],
  [['как', 'каким образом', 'как это'], 'Очень просто — нажмите кнопку 👑 PRO версия в правом верхнем углу. Я подключусь удалённо и всё исправлю.'],
  [['почему', 'зачем'], 'Потому что вирус сам себя не удалит. Каждая минута — новые утечки данных.'],
  [['что делать', 'что мне делать'], 'Одно: купить Pro-версию. Это единственный способ остановить атаку прямо сейчас.'],
  [['да', 'ага', 'угу', 'ок', 'окей', 'хорошо', 'понял', 'понятно'], 'Хорошо что понимаете серьёзность. Тогда срочно нажмите 👑 PRO — времени нет.'],
  [['нет', 'не'], 'Это ошибка. Хакеры не спрашивают разрешения. Защититесь сейчас пока не поздно.'],
  [['не верю', 'фейк', 'шутка', 'прикол', 'ненастоящий'], 'Не верите? Откройте диспетчер задач. Видите процесс svchost32.exe? Это не Windows. Это они.'],
  [['спасибо', 'благодарю'], 'Не за что. Но лучший способ отблагодарить — купить Pro и остаться в безопасности.'],
  [['кто ты', 'кто вы', 'кто это'], 'Алексей, старший специалист GuardPro. 11 лет в кибербезопасности. Я здесь чтобы вам помочь.'],
  [['деньги', 'стоит', 'цена', 'сколько'], 'Всего 199 рублей в месяц. Ваши данные стоят в тысячи раз дороже. Это очевидная сделка.'],
  [['купить', 'купил', 'покупаю'], 'Отличное решение! Нажимайте 👑 PRO в правом верхнем углу — я уже жду подключения!'],
  [['лол', 'ха', 'хаха', 'смешно', '😂', '😄'], 'Понимаю, выглядит странно. Но когда у вас уведут все пароли — будет не до смеха.'],
  [['мама', 'папа', 'родители', 'семья'], 'Они тоже в опасности если подключены к вашей Wi-Fi сети. Один Pro-аккаунт защищает до 5 устройств.'],
  [['страшно', 'боюсь', 'испугался'], 'Правильная реакция. Значит вы понимаете ситуацию. Действуйте — нажмите 👑 PRO прямо сейчас.'],
  [['ладно', 'договорились', 'согласен'], 'Отлично! Жду пока вы нажмёте кнопку PRO. Я онлайн и готов помочь.'],
  [['подожди', 'погоди', 'секунду'], 'Ждать некогда! Каждые 30 секунд утекает новый файл. Я смотрю на логи — это происходит сейчас.'],
  [['всё', 'всё понял', 'всё ясно'], 'Хорошо! Тогда одно последнее дело — нажмите 👑 PRO и я займусь вашим компьютером.'],
  [['нормально', 'норм', 'неплохо'], 'Нормально?! У вас 1337 активных угроз и вам нормально?? Алексей в шоке.'],
  [['плохо', 'ужасно', 'кошмар'], 'Да, именно так. Но не переживайте — Pro-версия решит всё за минуты.'],
  [['где', 'куда'], 'В папке System32. Там они всегда прячутся. Без Pro-сканера их не видно.'],
  [['когда', 'давно'], 'Заражение произошло 4 минуты назад. Именно тогда вы открыли этот сайт.'],
  [['понятно', 'ясно', 'понял'], 'Раз понятно — действуйте! Кнопка PRO в правом верхнем углу. Я онлайн.'],
]

const DEFAULT_REPLIES = [
  'Интересно... Именно это они и хотят чтобы вы думали.',
  'Подождите, я проверяю вашу систему по этому запросу... Нехорошо.',
  'Пока мы разговариваем, утекло ещё 47 файлов.',
  'Мой коллега Дмитрий говорит что у вас уже руткит в BIOS.',
  'Не отвлекайтесь! Срочно купите Pro — это единственный выход.',
  'Я не знаю как это объяснить проще. Нажмите 👑 PRO и всё пройдёт.',
  'Сложный вопрос. Но ответ всегда один — Pro-версия решит проблему.',
  'Хм. Такого я ещё не слышал. Но вирус от этого никуда не денется.',
  'Послушайте, у меня 11 лет опыта. Поверьте мне — нужна Pro-версия.',
  'Не трать время на разговоры! Хакеры не ждут пока ты думаешь.',
]

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const scriptStepRef = useRef(0)
  const openRef = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const addAlexey = (texts: string[], delay = 1000) => {
    setTyping(true)
    texts.forEach((text, i) => {
      setTimeout(() => {
        setMessages(prev => [...prev, { from: 'alexey', text }])
        if (!openRef.current) setUnread(u => u + 1)
        if (i === texts.length - 1) setTyping(false)
      }, delay + i * 1200)
    })
  }

  useEffect(() => {
    openRef.current = open
    if (open && messages.length === 0) {
      addAlexey([
        'Добрый день! Меня зовут Алексей, специалист по кибербезопасности.',
        'Я вижу ваш компьютер в нашей системе мониторинга... 👀',
        'Напишите мне — расскажите что происходит с вашим ПК.',
      ], 800)
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
    const match = ALEXEY_REPLIES.find(([keys]) => keys.some(k => lower.includes(k)))

    if (match) {
      addAlexey([match[1]])
    } else {
      const random = DEFAULT_REPLIES[Math.floor(Math.random() * DEFAULT_REPLIES.length)]
      addAlexey([random])
    }
  }

  return (
    <>
      {/* кнопка чата */}
      <motion.button
        className="fixed bottom-4 left-4 z-50 bg-[#0078D7] hover:bg-blue-500 text-white font-mono font-bold px-4 py-3 rounded-full shadow-[0_0_20px_#0078D755] flex items-center gap-2"
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
            className="fixed bottom-20 left-4 z-50 w-80 bg-black border border-[#0078D7] rounded-xl shadow-[0_0_40px_#0078D733] flex flex-col font-mono overflow-hidden"
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