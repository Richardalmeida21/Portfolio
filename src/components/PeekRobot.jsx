import { useState, useRef, useEffect } from 'react'
import './PeekRobot.css'

const CODY_MESSAGES = [
  { from: 'cody', text: 'Oi! Eu sou o Cody, assistente do Richard! 🤖' },
  { from: 'cody', text: 'Como posso te ajudar hoje?' },
]

const QUICK_REPLIES = [
  { label: '💼 Ver Projetos', action: 'projetos' },
  { label: '👤 Sobre o Richard', action: 'sobre' },
  { label: '💬 Falar com o Richard', action: 'mensagem' },
]

export default function PeekRobot() {
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showMsgInput, setShowMsgInput] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const [hovered, setHovered] = useState(false)
  const hoverTimer = useRef(null)
  const messagesEndRef = useRef(null)
  const cycleKey = useRef(0)

  // Ciclo do botão sincronizado com a animação do robô (7s, delay 2s)
  // Robot: 10-22% saindo, 22-58% fora, 58-70% voltando
  // Reinicia quando hover termina (animação CSS reinicia do 0)
  useEffect(() => {
    if (chatOpen || hovered) { setShowBtn(false); return }
    const key = ++cycleKey.current
    const DURATION = 7000
    let timeouts = []
    const runCycle = () => {
      if (cycleKey.current !== key) return
      timeouts.push(setTimeout(() => { if (cycleKey.current === key) setShowBtn(true) }, 1540))
      timeouts.push(setTimeout(() => { if (cycleKey.current === key) setShowBtn(false) }, 3920))
      timeouts.push(setTimeout(() => { if (cycleKey.current === key) runCycle() }, DURATION))
    }
    runCycle()
    return () => {
      timeouts.forEach(clearTimeout)
      setShowBtn(false)
    }
  }, [chatOpen, hovered])

  const handleMouseEnter = () => {
    clearTimeout(hoverTimer.current)
    setHovered(true)
  }

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => setHovered(false), 50)
  }

  // Quando abre o chat, mostra as mensagens do Cody com delay
  useEffect(() => {
    if (!chatOpen || messages.length > 0) return
    const t1 = setTimeout(() => setMessages([CODY_MESSAGES[0]]), 400)
    const t2 = setTimeout(() => setMessages([CODY_MESSAGES[0], CODY_MESSAGES[1]]), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [chatOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleOpen = () => setChatOpen(true)
  const handleClose = () => setChatOpen(false)

  const sendToWhatsApp = (text) => {
    setMessages(prev => [...prev, { from: 'user', text }])
    setInput('')
    setShowMsgInput(false)
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'cody', text: 'Enviando pro WhatsApp do Richard... 📱' }])
      setTimeout(() => {
        window.open('https://wa.me/5515996992742?text=' + encodeURIComponent(text), '_blank')
      }, 1200)
      setTimeout(() => {
        setMessages([])
        setChatOpen(false)
      }, 2500)
    }, 600)
  }

  const handleQuickReply = (action) => {
    if (action === 'projetos') {
      setMessages(prev => [...prev, { from: 'cody', text: 'Te levando pros projetos! 🚀' }])
      setTimeout(() => { window.location.href = '/projetos' }, 800)
    } else if (action === 'sobre') {
      setMessages(prev => [...prev, { from: 'cody', text: 'Bora conhecer o Richard! 😄' }])
      setTimeout(() => { window.location.href = '/sobre' }, 800)
    } else if (action === 'mensagem') {
      setMessages(prev => [...prev, { from: 'cody', text: 'Escreva sua mensagem abaixo que eu envio pro Richard! ✍️' }])
      setShowMsgInput(true)
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    sendToWhatsApp(input.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <>
      {/* Robô espiando */}
      <div
        className={`peek-robot ${chatOpen ? 'peek-robot--hidden' : ''} ${hovered && !chatOpen ? 'peek-robot--hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={`robot-speech-btn ${showBtn || hovered ? 'robot-speech-btn--visible' : ''}`}
          onClick={handleOpen}
        >
          Fale com Cody 💬
        </button>
        <div className="robot-body" onClick={handleOpen} style={{ cursor: 'pointer' }}>
          <div className="robot-head">
            <div className="robot-eye" />
            <div className="robot-eye" />
            <div className="robot-mouth" />
          </div>
          <div className="robot-torso">
            <div className="robot-arm robot-arm--left" />
            <div className="robot-arm robot-arm--right" />
          </div>
        </div>
      </div>

      {/* Chat widget */}
      {chatOpen && (
        <div className="cody-chat">
          <div className="cody-chat-header">
            <div className="cody-chat-avatar">
              <div className="cody-mini-head">
                <div className="cody-mini-eye" />
                <div className="cody-mini-eye" />
              </div>
            </div>
            <div className="cody-chat-info">
              <span className="cody-chat-name">Cody</span>
              <span className="cody-chat-status">Online</span>
            </div>
            <button className="cody-chat-close" onClick={handleClose}>✕</button>
          </div>

          <div className="cody-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`cody-msg cody-msg--${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {messages.length >= 2 && messages.every(m => m.from === 'cody') && (
              <div className="cody-quick-replies">
                {QUICK_REPLIES.map(qr => (
                  <button key={qr.action} className="cody-quick-btn" onClick={() => handleQuickReply(qr.action)}>
                    {qr.label}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showMsgInput && (
            <div className="cody-chat-input">
              <input
                type="text"
                placeholder="Escreva sua mensagem para o Richard..."
                value={input}
                autoFocus
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="cody-send-btn" onClick={handleSend}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
