import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const reviewsData = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Bangalore',
    rating: 5,
    avatar: '👩',
    trip: 'Kedarnath Trek',
    review:
      'I was terrified to travel with strangers. Now I have 14 new best friends from across India. The Kedarnath experience with Stranger\'s Camp was the most profound journey of my life. sarkeet.official has built something truly magical.',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    location: 'Mumbai',
    rating: 5,
    avatar: '👨',
    trip: 'Spiti Valley Expedition',
    review:
      'Spiti with Stranger\'s Camp destroyed my love for solo travel — because group travel with the right strangers is infinitely better.',
  },
  {
    id: 3,
    name: 'Divya Krishnan',
    location: 'Chennai',
    rating: 5,
    avatar: '👩🏽',
    trip: 'Goa Beach Bonfire',
    review:
      'I am an introvert and I was skeptical. But by Day 2, I felt like I had known these people for years. The beach bonfire on the last night had all of us in tears. Didn\'t want to leave.',
  },
  {
    id: 4,
    name: 'Rahul Verma',
    location: 'Delhi',
    rating: 5,
    avatar: '🧔',
    trip: 'Rann of Kutch',
    review:
      'Walking on white salt flats under a full moon with 13 strangers was surreal. I quit my job after this trip to travel more. Stranger\'s Camp changed my perspective on life. Not exaggerating.',
  },
  {
    id: 5,
    name: 'Sneha Patil',
    location: 'Pune',
    rating: 5,
    avatar: '👩🏻',
    trip: 'Coorg Rainforest Camp',
    review:
      'The coffee plantation walks, the group cooking session, the midnight rain — Coorg was poetry. The community sarkeet.official has built is genuinely wholesome and safe for solo female travelers.',
  },
  {
    id: 6,
    name: 'Karan Singh',
    location: 'Chandigarh',
    rating: 5,
    avatar: '👦🏼',
    trip: 'Kedarnath Trek',
    review:
      'First trip with Stranger\'s Camp. Just booked my third. That says everything. The way they curate the group dynamics is something else — you always end up with the most interesting mix of humans.',
  },
]

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-sc-slate'}`}>★</span>
    ))}
  </div>
)

const ReviewCard = ({ review, direction }) => (
  <motion.div
    initial={{ opacity: 0, x: direction === 'left' ? -60 : 60, scale: 0.9 }}
    whileInView={{ opacity: 1, x: 0, scale: 1 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="review-card"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-sc-slate/30 flex items-center justify-center text-2xl flex-shrink-0 border border-sc-teal/20">
        {review.avatar}
      </div>
      <div>
        <h4 className="font-display text-sc-light font-bold">{review.name}</h4>
        <p className="text-sc-light/40 font-body text-xs">{review.location}</p>
        <StarRating rating={review.rating} />
      </div>
      <div className="ml-auto">
        <span className="text-xs font-body bg-sc-teal/10 text-sc-teal px-2 py-1 rounded-full border border-sc-teal/20">
          {review.trip}
        </span>
      </div>
    </div>
    <p className="font-body text-sc-light/60 text-sm leading-relaxed italic">
      "{review.review}"
    </p>
  </motion.div>
)

const Reviews = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section id="reviews" ref={sectionRef} className="py-24 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-sc-teal/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="section-tag mb-4"
          >
            ✦ Traveler Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            Voices From The <span className="text-sc-teal">Journey</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-sc-light/50 font-body max-w-xl mx-auto"
          >
            Don't take our word for it. Here's what 100+ strangers-turned-friends have to say.
          </motion.p>

          {/* Rating summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center gap-4 mt-8"
          >
            <div className="text-5xl font-display font-black text-sc-teal">4.9</div>
            <div>
              <div className="flex gap-1 text-yellow-400 text-xl">★★★★★</div>
              <div className="text-sc-light/40 font-body text-xs mt-0.5">Based on 100+ reviews</div>
            </div>
          </motion.div>
        </div>

        {/* Reviews grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviewsData.map((review, i) => (
            <div key={review.id} className="break-inside-avoid mb-6">
              <ReviewCard
                review={review}
                direction={i % 2 === 0 ? 'left' : 'right'}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="font-accent italic text-sc-light/40 mb-6 text-lg">
            "The best trips are the ones you didn't plan."
          </p>
          <button
            className="btn-teal"
            onClick={() => document.querySelector('#trips').scrollIntoView({ behavior: 'smooth' })}
          >
            Start Your Story →
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Reviews
