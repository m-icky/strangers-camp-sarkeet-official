import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

/**
 * Lanyard – React Bits style
 * Physics-based draggable ID badge hanging from the top-right corner.
 * Shows travel guide contact details with realistic rope simulation.
 */

// Guide contact details
const GUIDE_INFO = {
  name: 'Sarkeet.Official',
  role: 'Lead Travel Guide',
  phone: '+91 81369 79054',
  email: 'sarkeet.official@gmail.com',
  trips: '10+ Trips Led',
  rating: '4.9 ★',
  badge: 'SC-001',
  initials: 'SS',
}

// SVG rope path between anchor and card
function RopeSVG({ anchorX, anchorY, cardX, cardY, cardW }) {
  const midX = (anchorX + cardX + cardW / 2) / 2
  const sag = Math.min(60 + Math.abs(cardX - anchorX) * 0.3, 100)
  const ctrlY = anchorY + sag

  return (
    <svg
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9997,
      }}
    >
      <defs>
        <linearGradient id="ropeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5BC0BE" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#3A506B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#5BC0BE" stopOpacity="0.6" />
        </linearGradient>
        <filter id="ropeShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(91,192,190,0.3)" />
        </filter>
      </defs>
      {/* Shadow rope */}
      <path
        d={`M ${anchorX} ${anchorY} Q ${midX} ${ctrlY} ${cardX + cardW / 2} ${cardY}`}
        fill="none"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="3"
        strokeLinecap="round"
        transform="translate(2, 3)"
      />
      {/* Main rope */}
      <path
        d={`M ${anchorX} ${anchorY} Q ${midX} ${ctrlY} ${cardX + cardW / 2} ${cardY}`}
        fill="none"
        stroke="url(#ropeGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#ropeShadow)"
      />
      {/* Rope texture segments */}
      {[0.2, 0.4, 0.6, 0.8].map((t) => {
        // Bezier point at t
        const bx = (1 - t) * (1 - t) * anchorX + 2 * (1 - t) * t * midX + t * t * (cardX + cardW / 2)
        const by = (1 - t) * (1 - t) * anchorY + 2 * (1 - t) * t * ctrlY + t * t * cardY
        return (
          <circle
            key={t}
            cx={bx}
            cy={by}
            r="2"
            fill="#5BC0BE"
            opacity="0.5"
          />
        )
      })}
      {/* Anchor clip at top */}
      <rect
        x={anchorX - 5}
        y={anchorY - 6}
        width="10"
        height="8"
        rx="2"
        fill="#3A506B"
        stroke="#5BC0BE"
        strokeWidth="1"
      />
      <line x1={anchorX} y1={anchorY - 8} x2={anchorX} y2={anchorY - 14} stroke="#5BC0BE" strokeWidth="2" />
    </svg>
  )
}

const CARD_W = 220
const CARD_H = 300
const ANCHOR_OFFSET_X = 30  // from right edge
const ANCHOR_Y = 64          // navbar height

const Lanyard = () => {
  const cardRef = useRef(null)
  const rafRef = useRef(null)
  const isAnimatingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: ANCHOR_Y })
  const [cardScreenPos, setCardScreenPos] = useState({ x: 0, y: 0 })

  // Motion value only for rotation (driven by drag offset)
  const dragX = useMotionValue(0)

  // Rotate based on x displacement
  const rotate = useTransform(dragX, [-150, 0, 150], [-18, 0, 18])

  // Initial position: top-right corner, offset from anchor
  const [initX, setInitX] = useState(0)
  const [initY, setInitY] = useState(0)

  useEffect(() => {
    const setPositions = () => {
      const ax = window.innerWidth - ANCHOR_OFFSET_X
      const ay = ANCHOR_Y + 4
      setAnchorPos({ x: ax, y: ay })

      // Card hangs naturally below anchor, offset left by half card width
      const cx = window.innerWidth - CARD_W - 16
      const cy = ay + 60
      setInitX(cx)
      setInitY(cy)
      setCardScreenPos({ x: cx, y: cy })
    }
    setPositions()
    window.addEventListener('resize', setPositions)
    return () => window.removeEventListener('resize', setPositions)
  }, [])

  // Continuously read the card's actual DOM position so the rope always stays attached
  const trackCardPosition = useCallback(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setCardScreenPos({ x: rect.left, y: rect.top })
    }
    rafRef.current = requestAnimationFrame(trackCardPosition)
  }, [])

  // Start/stop the RAF loop when dragging or animating back
  useEffect(() => {
    if (isDragging || isAnimatingRef.current) {
      rafRef.current = requestAnimationFrame(trackCardPosition)
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isDragging, trackCardPosition])

  const handleDragStart = () => setIsDragging(true)

  const handleDragEnd = () => {
    setIsDragging(false)
    // Start tracking during the snap-back animation so the rope follows
    isAnimatingRef.current = true
    rafRef.current = requestAnimationFrame(trackCardPosition)

    // Animate rotation back to 0
    animate(dragX, 0, { type: 'spring', stiffness: 80, damping: 8, mass: 1.5 })

    // Stop RAF tracking after the snap-back settles (generous timeout)
    setTimeout(() => {
      isAnimatingRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      // One final position read to ensure accuracy
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        setCardScreenPos({ x: rect.left, y: rect.top })
      }
    }, 2000)
  }

  // During drag, update the rotation motion value
  const handleDrag = useCallback((event, info) => {
    dragX.set(info.offset.x)
  }, [dragX])

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed z-[9998] flex items-center gap-2 px-3 py-2 glass border border-sc-teal/30 rounded-full text-sc-teal text-xs font-display tracking-wider shadow-lg"
        style={{ top: ANCHOR_Y + 8, right: 16 }}
      >
        <span>🪪</span> Guide Card
      </motion.button>
    )
  }

  return (
    <>
      {/* Rope SVG */}
      <RopeSVG
        anchorX={anchorPos.x}
        anchorY={anchorPos.y}
        cardX={cardScreenPos.x}
        cardY={cardScreenPos.y}
        cardW={CARD_W}
      />

      {/* Badge card */}
      <motion.div
        ref={cardRef}
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragElastic={1}
        dragMomentum={true}
        dragTransition={{
          bounceStiffness: 80,
          bounceDamping: 8,
          power: 0.3,
          timeConstant: 200,
        }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          rotate,
          position: 'fixed',
          top: initY,
          left: initX,
          width: CARD_W,
          zIndex: 9998,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        initial={{ opacity: 0, y: -40, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 200, delay: 0.5 }}
        whileHover={{ scale: isDragging ? 1 : 1.02 }}
      >
        {/* Card hole at top */}
        <div className="flex justify-center mb-1">
          <div
            className="w-5 h-5 rounded-full border-2 border-sc-teal/60"
            style={{ background: 'rgba(28,37,65,0.8)' }}
          />
        </div>

        {/* Card body */}
        <div
          style={{
            background: 'linear-gradient(160deg, #1C2541 0%, #0B132B 60%, #1C3048 100%)',
            border: '1px solid rgba(91,192,190,0.25)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: isDragging
              ? '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(91,192,190,0.2)'
              : '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(91,192,190,0.1)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Card header stripe */}
          <div
            style={{
              background: 'linear-gradient(90deg, #0B132B, #3A506B, #0B132B)',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(91,192,190,0.15)',
            }}
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="16" viewBox="0 0 32 26" fill="none">
                <polygon points="16,2 3,24 29,24" fill="none" stroke="#5BC0BE" strokeWidth="2" />
                <circle cx="16" cy="22" r="2" fill="#5BC0BE" />
              </svg>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '10px', color: '#5BC0BE', letterSpacing: '0.25em' }}>
                STRANGER'S CAMP
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ color: 'rgba(234,234,234,0.3)', fontSize: '25px', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
              className="hover:text-sc-teal transition-colors"
            >
              ×
            </button>
          </div>

          {/* Avatar section */}
          <div style={{ padding: '16px 16px 10px', textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3A506B, #5BC0BE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                border: '2px solid rgba(91,192,190,0.4)',
                boxShadow: '0 0 20px rgba(91,192,190,0.25)',
                fontSize: '22px',
                fontFamily: 'Cinzel, serif',
                fontWeight: 700,
                color: '#0B132B',
              }}
            >
              {GUIDE_INFO.initials}
            </div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', fontWeight: 700, color: '#EAEAEA', letterSpacing: '0.05em', lineHeight: 1.2 }}>
              {GUIDE_INFO.name}
            </div>
            <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: '11px', color: '#5BC0BE', marginTop: 4, letterSpacing: '0.15em' }}>
              {GUIDE_INFO.role}
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              background: 'rgba(91,192,190,0.1)',
              borderTop: '1px solid rgba(91,192,190,0.1)',
              borderBottom: '1px solid rgba(91,192,190,0.1)',
            }}
          >
            {[
              { label: 'Trips', value: GUIDE_INFO.trips },
              { label: 'Rating', value: GUIDE_INFO.rating },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 0',
                  textAlign: 'center',
                  background: 'rgba(11,19,43,0.5)',
                  borderRight: i === 0 ? '1px solid rgba(91,192,190,0.1)' : 'none',
                }}
              >
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 700, color: '#5BC0BE' }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: '9px', color: '#EAEAEA', letterSpacing: '0.2em', marginTop: 1 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Contact details */}
          <div style={{ padding: '12px 16px 14px' }}>
            {[
              { icon: '📞', label: 'Phone', value: GUIDE_INFO.phone },
              { icon: '✉️', label: 'Email', value: GUIDE_INFO.email },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginBottom: i === 0 ? 10 : 0,
                  padding: '8px 10px',
                  background: 'rgba(58,80,107,0.15)',
                  borderRadius: '8px',
                  border: '1px solid rgba(91,192,190,0.08)',
                }}
              >
                <span style={{ fontSize: '13px', marginTop: 1 }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: '9px', color: 'rgba(234,234,234,0.3)', letterSpacing: '0.2em', marginBottom: 2 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: '11px', color: '#EAEAEA', fontWeight: 500 }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Badge ID footer */}
          <div
            style={{
              padding: '8px 16px',
              borderTop: '1px solid rgba(91,192,190,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(11,19,43,0.4)',
            }}
          >
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '10px', color: 'rgba(255,255,255,1)', letterSpacing: '0.2em' }}>
              ID: {GUIDE_INFO.badge}
            </span>
            {/* Barcode-like decoration */}
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              {[3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 1.5,
                    height: h * 3,
                    background: 'rgba(255,255,255,1)',
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
            <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: '9px', color: 'rgba(255, 255, 255, 1)' }}>
              2026
            </span>
          </div>
        </div>

        {/* Drag hint */}
        {!isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            style={{
              textAlign: 'center',
              marginTop: 6,
              fontFamily: 'Raleway, sans-serif',
              fontSize: '9px',
              color: 'rgba(91,192,190,0.4)',
              letterSpacing: '0.2em',
              pointerEvents: 'none',
            }}
          >
            DRAG ME
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

export default Lanyard
