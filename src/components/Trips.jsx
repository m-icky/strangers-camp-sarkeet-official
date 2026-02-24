import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import TripModal from './TripModal'

export const tripsData = [
  {
    id: 1,
    name: 'Kedarnath Trek',
    location: 'Uttarakhand, India',
    date: 'March 15–22, 2025',
    difficulty: 'Hard',
    price: '₹8,500',
    status: 'upcoming',
    image: null,
    emoji: '🏔️',
    tag: 'Snow Trek',
    spots: 8,
    totalSpots: 15,
    itinerary: [
      'Day 1: Arrival at Haridwar, group dinner & briefing',
      'Day 2: Drive to Gaurikund, trek to Rambara (13km)',
      'Day 3: Trek to Kedarnath temple (6km)',
      'Day 4: Temple visit & rest day',
      'Day 5: Trek back to Gaurikund',
      'Day 6: Drive to Rishikesh, celebration dinner',
      'Day 7: Departure',
    ],
    includes: ['Accommodation', 'Meals (Day 2–6)', 'Guide', 'First Aid Kit', 'Bonfire Nights', 'Group Photos'],
    gallery: ['🏔️', '⛺', '🌨️', '🛕', '🔥', '🌅'],
    description: 'Trek to one of the holiest shrines in India through breathtaking Himalayan terrain. Bond with strangers over shared struggles and incredible vistas.',
  },
  {
    id: 2,
    name: 'Goa Beach Bonfire',
    location: 'North Goa, India',
    date: 'February 8–12, 2025',
    difficulty: 'Easy',
    price: '₹5,200',
    status: 'ongoing',
    image: null,
    emoji: '🏖️',
    tag: 'Beach Retreat',
    spots: 0,
    totalSpots: 12,
    itinerary: [
      'Day 1: Arrival & sunset beach walk',
      'Day 2: Water sports & cliff diving',
      'Day 3: Flea market & local food tour',
      'Day 4: Beach bonfire, guitar session, stargazing',
      'Day 5: Departure morning',
    ],
    includes: ['Beach resort', 'Breakfast', 'Water Sports (1 session)', 'Bonfire', 'Guide'],
    gallery: ['🏖️', '🌊', '🎸', '🔥', '🌟', '🤿'],
    description: 'Sun, sand, and strangers. Spend 5 days on the shores of North Goa making memories that last forever.',
  },
  {
    id: 3,
    name: 'Spiti Valley Expedition',
    location: 'Himachal Pradesh, India',
    date: 'June 2–10, 2024',
    difficulty: 'Expert',
    price: '₹14,000',
    status: 'completed',
    image: null,
    emoji: '🌄',
    tag: 'Desert Mountains',
    spots: 0,
    totalSpots: 10,
    itinerary: [
      'Day 1–2: Manali to Kaza via Kunzum Pass',
      'Day 3: Key Monastery & Kibber Village',
      'Day 4: Chandratal Lake (4300m)',
      'Day 5–6: Tabo caves & Dhankar Lake',
      'Day 7–8: Mud Village, Pin Valley NP',
      'Day 9: Return journey',
    ],
    includes: ['All accommodation', 'All meals', 'SUV transport', 'Guide', 'Permits', 'First Aid'],
    gallery: ['🌄', '🏔️', '🛕', '❄️', '🦅', '🌙'],
    description: 'The most remote and surreal landscape in India. Cold desert, Buddhist monasteries, and 10 strangers who became family.',
  },
  {
    id: 4,
    name: 'Coorg Rainforest Camp',
    location: 'Karnataka, India',
    date: 'April 5–8, 2025',
    difficulty: 'Easy',
    price: '₹4,800',
    status: 'upcoming',
    image: null,
    emoji: '🌿',
    tag: 'Forest Retreat',
    spots: 11,
    totalSpots: 16,
    itinerary: [
      'Day 1: Arrive at estate, welcome campfire',
      'Day 2: Coffee plantation walk, waterfall trek',
      'Day 3: River rafting (optional), group cooking',
      'Day 4: Morning yoga, departure',
    ],
    includes: ['Glamping tents', 'All meals', 'Plantation tour', 'Campfire', 'River rafting (optional)'],
    gallery: ['🌿', '☕', '🌊', '🏕️', '🌧️', '🦋'],
    description: 'Lose yourself in the misty hills of Coorg. Coffee, rain, and strangers under the stars.',
  },
  {
    id: 5,
    name: 'Rann of Kutch Sunrise',
    location: 'Gujarat, India',
    date: 'November 14–17, 2024',
    difficulty: 'Moderate',
    price: '₹6,500',
    status: 'completed',
    image: null,
    emoji: '🌅',
    tag: 'Salt Desert',
    spots: 0,
    totalSpots: 14,
    itinerary: [
      'Day 1: Arrival at Bhuj, cultural dinner',
      'Day 2: White Rann trek, sunset photography',
      'Day 3: Full Moon night camp at Rann',
      'Day 4: Mandvi Beach & return',
    ],
    includes: ['Desert camps', 'All meals', 'Cultural show', 'Guide', 'Camel ride'],
    gallery: ['🌅', '🐪', '🌕', '🎭', '🏜️', '✨'],
    description: 'Walk on the largest salt flat in the world under a full moon. Silence, stars, and strangers.',
  },
  {
    id: 6,
    name: 'Meghalaya Caves & Bridges',
    location: 'Meghalaya, India',
    date: 'May 20–26, 2025',
    difficulty: 'Moderate',
    price: '₹9,200',
    status: 'upcoming',
    image: null,
    emoji: '🌉',
    tag: 'Living Roots',
    spots: 5,
    totalSpots: 12,
    itinerary: [
      'Day 1: Shillong arrival, explore Police Bazaar',
      'Day 2: Living Root Bridge trek (Nongriat)',
      'Day 3: Mawsmai Cave & Seven Sisters Falls',
      'Day 4: Dawki river kayaking',
      'Day 5: Sohra sunrise & return',
      'Day 6: Departure',
    ],
    includes: ['Homestays', 'Local meals', 'Guide', 'Kayak session', 'Permits'],
    gallery: ['🌉', '🌿', '💧', '🛶', '🌫️', '🌈'],
    description: 'Ancient living root bridges, crystal rivers, and the wettest place on earth. Pure magic.',
  },
]

const statusConfig = {
  upcoming: { label: 'Upcoming', color: 'text-sc-teal bg-sc-teal/10 border-sc-teal/30' },
  ongoing: { label: 'Ongoing 🔴', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
  completed: { label: 'Completed', color: 'text-sc-light/50 bg-white/5 border-white/10' },
}

const difficultyConfig = {
  Easy: 'text-green-400',
  Moderate: 'text-yellow-400',
  Hard: 'text-orange-400',
  Expert: 'text-red-400',
}

const TripCard = ({ trip, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -12, rotateX: 3 }}
      onClick={() => onClick(trip)}
      className="trip-card glass-card p-0 overflow-hidden cursor-pointer group"
    >
      {/* Card image area */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #1C2541, #0B132B)`,
        }}
      >
        <div className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(91,192,190,0.2), transparent 70%)`,
          }}
        />
        <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-500">
          {trip.emoji}
        </span>
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-display px-3 py-1 rounded-full border font-semibold ${statusConfig[trip.status].color}`}>
            {statusConfig[trip.status].label}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="text-xs font-body bg-sc-dark/60 text-sc-teal px-2 py-0.5 rounded-full border border-sc-teal/20">
            {trip.tag}
          </span>
        </div>
        {/* Gradient border glow on hover */}
        <div className="absolute inset-0 border-2 border-sc-teal/0 group-hover:border-sc-teal/30 rounded-t-3xl transition-all duration-300" />
      </div>

      {/* Card content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-sc-light mb-1 group-hover:text-sc-teal transition-colors">
          {trip.name}
        </h3>
        <p className="text-sc-light/50 text-sm font-body mb-4">📍 {trip.location}</p>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <div className="text-sc-light/30 text-xs font-body mb-0.5">Date</div>
            <div className="text-sc-light/80 font-body text-xs">{trip.date}</div>
          </div>
          <div>
            <div className="text-sc-light/30 text-xs font-body mb-0.5">Difficulty</div>
            <div className={`font-body font-semibold text-xs ${difficultyConfig[trip.difficulty]}`}>
              {trip.difficulty}
            </div>
          </div>
          <div>
            <div className="text-sc-light/30 text-xs font-body mb-0.5">Price</div>
            <div className="text-sc-teal font-display font-bold">{trip.price}</div>
          </div>
          <div>
            <div className="text-sc-light/30 text-xs font-body mb-0.5">Spots</div>
            <div className="text-sc-light/80 font-body text-xs">
              {trip.status === 'completed' ? 'Closed' : `${trip.spots} left`}
            </div>
          </div>
        </div>

        {/* Spots progress */}
        {trip.status !== 'completed' && (
          <div className="mb-4">
            <div className="h-1 bg-sc-slate/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sc-teal to-sc-slate rounded-full"
                style={{ width: `${((trip.totalSpots - trip.spots) / trip.totalSpots) * 100}%` }}
              />
            </div>
          </div>
        )}

        <button
          className={`w-full py-2.5 rounded-xl font-display text-sm font-semibold tracking-wider transition-all duration-300 ${
            trip.status === 'completed'
              ? 'bg-sc-slate/20 text-sc-light/30 cursor-not-allowed'
              : trip.status === 'ongoing'
              ? 'bg-orange-400/20 text-orange-400 border border-orange-400/30 hover:bg-orange-400/30'
              : 'btn-teal'
          }`}
          disabled={trip.status === 'completed'}
        >
          {trip.status === 'completed' ? 'Trip Completed' : trip.status === 'ongoing' ? 'View Details' : 'Join Trip →'}
        </button>
      </div>
    </motion.div>
  )
}

const Trips = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTrip, setSelectedTrip] = useState(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const tabs = [
    { id: 'all', label: 'All Trips' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' },
  ]

  const filteredTrips = activeTab === 'all'
    ? tripsData
    : tripsData.filter(t => t.status === activeTab)

  return (
    <section id="trips" ref={sectionRef} className="py-24 lg:py-36 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-sc-teal/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="section-tag mb-4"
          >
            ✦ Our Expeditions
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            Find Your Next <span className="text-sc-teal">Adventure</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-sc-light/50 font-body max-w-xl mx-auto"
          >
            Every trip is a new story. Pick yours, show up, and let the journey do the rest.
          </motion.p>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="flex gap-2 glass p-1.5 rounded-full">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-display font-semibold tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-sc-teal text-sc-dark shadow-lg shadow-sc-teal/30'
                    : 'text-sc-light/50 hover:text-sc-light'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trip grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTrips.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <TripCard trip={trip} onClick={setSelectedTrip} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Trip Modal */}
      <AnimatePresence>
        {selectedTrip && (
          <TripModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Trips
