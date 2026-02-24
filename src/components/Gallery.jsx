import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const galleryItems = [
  { emoji: '🏔️', label: 'Kedarnath Peaks', aspect: 'tall', color: '#1C2541' },
  { emoji: '🔥', label: 'Bonfire Night', aspect: 'wide', color: '#2D1810' },
  { emoji: '🌅', label: 'Rann Sunrise', aspect: 'square', color: '#1a1520' },
  { emoji: '🌿', label: 'Coorg Greens', aspect: 'tall', color: '#0D1F0D' },
  { emoji: '🛕', label: 'Kedarnath Temple', aspect: 'square', color: '#1C1A10' },
  { emoji: '🏖️', label: 'Goa Shores', aspect: 'wide', color: '#0D1520' },
  { emoji: '🌉', label: 'Root Bridge', aspect: 'tall', color: '#0D1A10' },
  { emoji: '❄️', label: 'Spiti Snow', aspect: 'square', color: '#0D1525' },
  { emoji: '🐪', label: 'Kutch Desert', aspect: 'wide', color: '#1A140D' },
  { emoji: '🌊', label: 'Dawki River', aspect: 'tall', color: '#0D1520' },
  { emoji: '🌙', label: 'Starry Nights', aspect: 'square', color: '#0B0E1C' },
  { emoji: '⛺', label: 'Camp Mornings', aspect: 'wide', color: '#151A1C' },
  { emoji: '🦋', label: 'Forest Life', aspect: 'square', color: '#0D1A0D' },
  { emoji: '🌄', label: 'Valley Views', aspect: 'tall', color: '#1A1520' },
  { emoji: '👥', label: 'New Friends', aspect: 'wide', color: '#1C1C2A' },
]

const heightMap = {
  tall: 320,
  wide: 200,
  square: 240,
}

const GalleryItem = ({ item, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}
      className="masonry-item relative overflow-hidden cursor-pointer group"
      style={{
        height: heightMap[item.aspect],
        background: item.color,
        border: '1px solid rgba(91,192,190,0.08)',
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(91,192,190,0.2), transparent 70%)`,
        }}
      />

      {/* Main emoji */}
      <motion.div
        whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ fontSize: heightMap[item.aspect] * 0.35 }}
      >
        {item.emoji}
      </motion.div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-sc-dark/0 group-hover:bg-sc-dark/60 transition-all duration-400 flex items-end">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          className="p-4 w-full"
        >
          <p className="font-display text-sm text-sc-light font-bold tracking-wider">{item.label}</p>
          <div className="w-8 h-0.5 bg-sc-teal mt-1 rounded-full" />
        </motion.div>
      </div>

      {/* Corner tag */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 glass rounded-full flex items-center justify-center">
          <span className="text-sc-teal text-xs">↗</span>
        </div>
      </div>
    </motion.div>
  )
}

const Gallery = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  // Split into 3 columns for masonry
  const col1 = galleryItems.filter((_, i) => i % 3 === 0)
  const col2 = galleryItems.filter((_, i) => i % 3 === 1)
  const col3 = galleryItems.filter((_, i) => i % 3 === 2)

  return (
    <section id="gallery" ref={sectionRef} className="py-24 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-sc-teal/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="section-tag mb-4"
          >
            ✦ Moments Captured
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            The <span className="text-sc-teal">Gallery</span> of Memories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-sc-light/50 font-body max-w-xl mx-auto"
          >
            Every frame tells a story of strangers who became something more.
          </motion.p>
        </div>

        {/* Masonry Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-4">
          {[col1, col2, col3].map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {col.map((item, itemIndex) => (
                <GalleryItem
                  key={item.label}
                  item={item}
                  index={colIndex * 5 + itemIndex}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile: 2 column grid */}
        <div className="lg:hidden grid grid-cols-2 gap-3">
          {galleryItems.map((item, i) => (
            <GalleryItem key={item.label} item={item} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sc-light/30 font-body text-sm mb-4">
            Follow <span className="text-sc-teal">@sarkeet.official</span> for more
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Gallery
