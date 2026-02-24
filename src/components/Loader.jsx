import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <motion.div
      className="loader-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Starfield */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.1,
            }}
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Tent SVG illustration */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tent */}
          <polygon points="60,10 10,80 110,80" fill="none" stroke="#5BC0BE" strokeWidth="2" />
          <polygon points="60,10 35,80 85,80" fill="rgba(91,192,190,0.15)" stroke="#5BC0BE" strokeWidth="1" />
          {/* Door */}
          <path d="M 52 80 Q 60 60 68 80" fill="rgba(11,19,43,0.8)" stroke="#3A506B" strokeWidth="1" />
          {/* Ground */}
          <line x1="0" y1="80" x2="120" y2="80" stroke="#3A506B" strokeWidth="1" strokeDasharray="4,4" />
          {/* Stars */}
          <circle cx="20" cy="20" r="2" fill="#5BC0BE" opacity="0.8" />
          <circle cx="90" cy="15" r="1.5" fill="#EAEAEA" opacity="0.6" />
          <circle cx="105" cy="35" r="1" fill="#5BC0BE" opacity="0.7" />
          {/* Fire glow */}
          <ellipse cx="60" cy="88" rx="8" ry="3" fill="rgba(255,107,53,0.3)" />
          <polygon points="60,72 55,85 65,85" fill="#FF6B35" opacity="0.8" />
          <polygon points="60,76 57,84 63,84" fill="#FFA500" opacity="0.9" />
        </svg>

        {/* Camp name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display text-3xl font-bold gradient-text mt-6 tracking-widest text-center"
        >
          STRANGER'S CAMP
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-sc-teal text-xs font-body tracking-[0.4em] mt-2 uppercase"
        >
          by sarkeet.official
        </motion.p>

        {/* Loading bar */}
        <motion.div
          className="mt-8 h-0.5 bg-sc-slate rounded-full overflow-hidden"
          style={{ width: 200 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-sc-teal to-sc-slate rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
          className="text-sc-light/40 text-xs font-body mt-3 tracking-widest"
        >
          PREPARING YOUR ADVENTURE...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default Loader
