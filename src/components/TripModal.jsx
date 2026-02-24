import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const TripModal = ({ trip, onClose }) => {
  const handleBook = () => {
    if (trip.status === 'completed') return
    toast.success(`Booking request sent for ${trip.name}! We'll reach out shortly. 🏕️`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="modal-content"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{trip.emoji}</div>
            <div>
              <h2 className="font-display text-2xl font-bold text-sc-light">{trip.name}</h2>
              <p className="text-sc-teal font-body text-sm">📍 {trip.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full glass text-sc-light/60 hover:text-sc-teal transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* Description */}
        <p className="font-body text-sc-light/60 mb-6 leading-relaxed">{trip.description}</p>

        {/* Key info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Date', value: trip.date },
            { label: 'Price', value: trip.price },
            { label: 'Difficulty', value: trip.difficulty },
            { label: 'Status', value: trip.status.charAt(0).toUpperCase() + trip.status.slice(1) },
          ].map((item, i) => (
            <div key={i} className="glass p-3 rounded-xl text-center">
              <div className="text-sc-light/30 text-xs font-body mb-1">{item.label}</div>
              <div className="text-sc-teal font-display font-bold text-sm">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Itinerary */}
        <div className="mb-8">
          <h3 className="font-display text-lg font-bold text-sc-light mb-4">📋 Itinerary</h3>
          <div className="space-y-3">
            {trip.itinerary.map((day, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-sc-teal/20 border border-sc-teal/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sc-teal text-xs font-display font-bold">{i + 1}</span>
                </div>
                <p className="font-body text-sc-light/70 text-sm leading-relaxed">{day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What's included */}
        <div className="mb-8">
          <h3 className="font-display text-lg font-bold text-sc-light mb-4">✅ What's Included</h3>
          <div className="flex flex-wrap gap-2">
            {trip.includes.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-xs font-body bg-sc-teal/10 border border-sc-teal/20 text-sc-teal rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Gallery emojis */}
        <div className="mb-8">
          <h3 className="font-display text-lg font-bold text-sc-light mb-4">📸 Gallery</h3>
          <div className="grid grid-cols-6 gap-2">
            {trip.gallery.map((emoji, i) => (
              <div
                key={i}
                className="aspect-square glass rounded-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-pointer"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mb-8">
          <h3 className="font-display text-lg font-bold text-sc-light mb-4">🗺️ Location</h3>
          <div className="glass rounded-xl h-32 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">📍</div>
              <p className="text-sc-light/40 font-body text-sm">{trip.location}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <button
            onClick={handleBook}
            className={`flex-1 py-3 rounded-xl font-display font-bold tracking-wider text-sm transition-all duration-300 ${
              trip.status === 'completed'
                ? 'bg-sc-slate/20 text-sc-light/30 cursor-not-allowed'
                : 'btn-teal text-center'
            }`}
          >
            {trip.status === 'completed' ? 'Trip Completed' : '🏕️ Book Now — ' + trip.price}
          </button>
          <button
            onClick={onClose}
            className="btn-outline px-6 py-3 text-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TripModal
