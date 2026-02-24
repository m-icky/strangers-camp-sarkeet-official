import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const timelineItems = [
  {
    year: '2021',
    title: 'The Spark',
    desc: 'One solo traveler, one random campfire, and six complete strangers who became lifelong friends. That\'s how Stranger\'s Camp was born.',
  },
  {
    year: '2022',
    title: 'First Official Trip',
    desc: 'We organized our first official batch of 12 strangers to Kedarnath Trek. Every single one of them stayed connected.',
  },
  {
    year: '2023',
    title: 'Community Grows',
    desc: 'Over 200 members joined. We expanded to beaches, deserts, forests, and mountains across India.',
  },
  {
    year: '2024',
    title: 'Going National',
    desc: 'Partnerships formed. 500+ strangers met. Features in travel magazines. Our community became a movement.',
  },
  {
    year: '2026',
    title: 'International Chapters',
    desc: 'Nepal, Bhutan, Sri Lanka. Stranger\'s Camp goes beyond borders, because strangers exist everywhere.',
  },
]

const AboutTravelerSVG = () => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
    {/* Sky */}
    <rect width="300" height="300" fill="#0B132B" rx="20" />
    {/* Stars */}
    {[...Array(20)].map((_, i) => (
      <circle
        key={i}
        cx={Math.sin(i * 137.5) * 130 + 150}
        cy={Math.cos(i * 137.5) * 50 + 60}
        r={Math.random() * 2 + 0.5}
        fill="#EAEAEA"
        opacity={Math.random() * 0.8 + 0.2}
      />
    ))}
    {/* Moon */}
    <circle cx="230" cy="50" r="20" fill="#5BC0BE" opacity="0.4" />
    <circle cx="240" cy="45" r="16" fill="#0B132B" />
    {/* Mountains */}
    <polygon points="0,220 80,100 160,220" fill="#1C2541" />
    <polygon points="100,220 200,80 300,220" fill="#1C2541" />
    <polygon points="50,220 140,130 230,220" fill="#3A506B" opacity="0.7" />
    {/* Ground */}
    <rect x="0" y="220" width="300" height="80" fill="#1C2541" />
    {/* Tent */}
    <polygon points="110,220 150,160 190,220" fill="#3A506B" />
    <polygon points="130,220 150,170 170,220" fill="#1C2541" />
    {/* Campfire */}
    <ellipse cx="220" cy="222" rx="12" ry="4" fill="#FF6B3520" />
    <polygon points="220,205 213,222 227,222" fill="#FF6B35" />
    <polygon points="220,210 215,221 225,221" fill="#FFA500" />
    {/* Figures - 3 travelers */}
    {[160, 200, 240].map((x, i) => (
      <g key={i}>
        <circle cx={x} cy="207" r="6" fill="#5BC0BE" opacity="0.9" />
        <line x1={x} y1="213" x2={x} y2="232" stroke="#5BC0BE" strokeWidth="2.5" />
        <line x1={x} y1="220" x2={x - 6} y2="228" stroke="#5BC0BE" strokeWidth="2" />
        <line x1={x} y1="220" x2={x + 6} y2="228" stroke="#5BC0BE" strokeWidth="2" />
        <line x1={x} y1="232" x2={x - 5} y2="248" stroke="#5BC0BE" strokeWidth="2" />
        <line x1={x} y1="232" x2={x + 5} y2="248" stroke="#5BC0BE" strokeWidth="2" />
      </g>
    ))}
    {/* Trees */}
    <polygon points="20,220 35,185 50,220" fill="#1C2541" />
    <rect x="33" y="220" width="4" height="15" fill="#3A2010" />
    <polygon points="250,220 265,185 280,220" fill="#1C2541" />
    <rect x="263" y="220" width="4" height="15" fill="#3A2010" />
    {/* Text at bottom */}
    <text x="150" y="290" textAnchor="middle" fill="#5BC0BE" fontSize="10" fontFamily="Cinzel" letterSpacing="3">
      STRANGER'S CAMP
    </text>
  </svg>
)

const About = () => {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-36 relative overflow-hidden">
      {/* BG decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sc-teal/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sc-slate/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-tag mb-4"
          >
            ✦ Who We Are
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="section-title mb-6"
          >
            A Community Born From{' '}
            <span className="text-sc-teal">Wanderlust</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-body text-sc-light/60 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Stranger's Camp is not just a travel group. It's a movement that believes
            the best adventures happen when you step outside your comfort zone and
            share the journey with someone you've never met — yet.
          </motion.p>
        </div>

        {/* Two column: illustration + mission */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-28">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-sc-teal/5 rounded-3xl blur-xl" />
            <div className="relative glass-card p-4">
              <AboutTravelerSVG />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-8"
          >
            {[
              {
                icon: '🔥',
                title: 'Our Mission',
                desc: 'To break the walls between strangers and create real human connections through shared adventures in nature.',
              },
              {
                icon: '🏕️',
                title: 'Our Experience',
                desc: 'Curated trips with like-minded travelers. Every detail planned, every moment spontaneous. Safety first, adventure always.',
              },
              {
                icon: '🌍',
                title: 'Our Community',
                desc: 'A growing family of 500+ adventurers from all walks of life who believe that travel is better shared.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="flex gap-4"
              >
                <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-display text-lg font-bold text-sc-teal mb-2">{item.title}</h3>
                  <p className="font-body text-sc-light/60 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className="section-tag mb-3">Our Journey</div>
            <h3 className="section-title text-3xl">How It All Started</h3>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sc-teal/50 via-sc-teal/20 to-transparent hidden lg:block" />

            <div className="space-y-8 lg:space-y-0">
              {timelineItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.6 + i * 0.1 }}
                  className={`relative lg:flex ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center lg:mb-12`}
                >
                  <div className={`lg:w-5/12 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="glass-card p-6 hover:border-sc-teal/30 transition-all duration-300">
                      <div className="section-tag mb-2">{item.year}</div>
                      <h4 className="font-display text-xl font-bold text-sc-light mb-2">{item.title}</h4>
                      <p className="font-body text-sc-light/60 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden lg:flex w-2/12 justify-center">
                    <div className="w-4 h-4 rounded-full bg-sc-teal border-4 border-sc-dark shadow-lg shadow-sc-teal/30 relative z-10" />
                  </div>

                  <div className="lg:w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
