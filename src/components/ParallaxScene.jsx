import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ParallaxScene = () => {
  const containerRef = useRef(null)
  const skyRef = useRef(null)
  const mountainsRef = useRef(null)
  const treesRef = useRef(null)
  const groundRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      // Sky layer - slowest
      gsap.to(skyRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Mountains - medium
      gsap.to(mountainsRef.current, {
        yPercent: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // Trees - fastest
      gsap.to(treesRef.current, {
        yPercent: -55,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      })

      // Text
      gsap.from(textRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="parallax-container relative overflow-hidden"
      style={{ height: '100vh', minHeight: 600 }}
    >
      {/* Sky Layer */}
      <div
        ref={skyRef}
        className="absolute inset-0 w-full"
        style={{ height: '130%', top: '-15%' }}
      >
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          {/* Deep sky gradient */}
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="40%" stopColor="#1C2541" />
              <stop offset="100%" stopColor="#3A506B" />
            </linearGradient>
            <radialGradient id="moonGlow" cx="80%" cy="15%" r="20%">
              <stop offset="0%" stopColor="#5BC0BE" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0B132B" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1440" height="900" fill="url(#skyGrad)" />
          <rect width="1440" height="900" fill="url(#moonGlow)" />

          {/* Moon */}
          <circle cx="1150" cy="130" r="50" fill="#B8D4E8" opacity="0.6" />
          <circle cx="1165" cy="120" r="40" fill="#1C2541" opacity="0.5" />

          {/* Stars */}
          {[...Array(80)].map((_, i) => {
            const x = (i * 137.5 % 1440)
            const y = (i * 97.3 % 500)
            const r = (i % 3) === 0 ? 2 : 1.2
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                fill="#EAEAEA"
                opacity={0.3 + (i % 5) * 0.1}
              />
            )
          })}

          {/* Milky way hint */}
          <ellipse cx="720" cy="200" rx="400" ry="60" fill="#5BC0BE" opacity="0.03" />
        </svg>
      </div>

      {/* Mountains Layer */}
      <div
        ref={mountainsRef}
        className="absolute bottom-0 w-full"
        style={{ height: '65%' }}
      >
        <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
          <defs>
            <linearGradient id="mtnGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1C2541" />
              <stop offset="100%" stopColor="#0B132B" />
            </linearGradient>
            <linearGradient id="mtnGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A506B" />
              <stop offset="100%" stopColor="#1C2541" />
            </linearGradient>
          </defs>
          {/* Back mountains */}
          <polygon points="0,600 200,200 400,350 600,150 800,300 1000,120 1200,280 1440,180 1440,600" fill="url(#mtnGrad1)" />
          {/* Snow caps */}
          <polygon points="600,150 560,230 640,230" fill="#EAEAEA" opacity="0.4" />
          <polygon points="1000,120 960,200 1040,200" fill="#EAEAEA" opacity="0.3" />
          {/* Mid mountains */}
          <polygon points="0,600 150,350 350,420 550,280 750,380 950,260 1150,360 1350,300 1440,340 1440,600" fill="url(#mtnGrad2)" opacity="0.8" />
        </svg>
      </div>

      {/* Trees Foreground Layer */}
      <div
        ref={treesRef}
        className="absolute bottom-0 w-full"
        style={{ height: '50%' }}
      >
        <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
          {/* Ground */}
          <rect x="0" y="300" width="1440" height="100" fill="#0B132B" />
          {/* Tree silhouettes */}
          {[
            [50, 260, 40, 120], [140, 240, 35, 130], [250, 255, 38, 115],
            [380, 245, 42, 125], [520, 250, 36, 120], [640, 238, 44, 130],
            [780, 252, 37, 118], [900, 242, 41, 128], [1020, 248, 39, 122],
            [1150, 240, 43, 130], [1280, 255, 36, 115], [1380, 245, 40, 125],
          ].map(([x, y, w, h], i) => (
            <g key={i}>
              <polygon
                points={`${x},${y} ${x - w / 2},${y + h} ${x + w / 2},${y + h}`}
                fill="#1C2541"
              />
              <polygon
                points={`${x},${y + h * 0.25} ${x - w * 0.4},${y + h} ${x + w * 0.4},${y + h}`}
                fill="#0B132B"
                opacity="0.5"
              />
              <rect x={x - 4} y={y + h} width={8} height={30} fill="#3A2010" />
            </g>
          ))}

          {/* Campfire in center */}
          <ellipse cx="720" cy="305" rx="15" ry="5" fill="#FF6B3540" />
          <polygon points="720,280 710,305 730,305" fill="#FF6B35" opacity="0.9" />
          <polygon points="720,285 713,303 727,303" fill="#FFA500" opacity="0.8" />
          <polygon points="720,288 716,302 724,302" fill="#FFD700" opacity="0.7" />

          {/* Tent silhouette */}
          <polygon points="670,300 720,260 770,300" fill="#3A506B" />
          <polygon points="690,300 720,268 750,300" fill="#1C2541" />
        </svg>
      </div>

      {/* Ground */}
      <div ref={groundRef} className="absolute bottom-0 w-full h-24 bg-sc-dark" />

      {/* Center Text */}
      <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="text-center px-4">
          <div className="section-tag mb-4">✦ The Experience</div>
          <h2 className="section-title text-sc-light mb-4">
            Every Night Becomes <span className="text-sc-teal">Legendary</span>
          </h2>
          <p className="font-body text-sc-light/50 max-w-lg mx-auto text-lg">
            Stars above. Strangers beside. Stories unfolding.
          </p>
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(11,19,43,0.7) 100%)',
        }}
      />
    </section>
  )
}

export default ParallaxScene
