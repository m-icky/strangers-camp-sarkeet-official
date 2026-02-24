import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'
import { sendBookingEmail } from '../lib/emailjs'

const TripModal = ({ trip, onClose }) => {
  // 'details' | 'form' | 'success'
  const [step, setStep] = useState('details')
  const [sending, setSending] = useState(false)
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    emergencyContact: '',
    age: '',
    bloodGroup: '',
    description: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Name is required'
    if (!formData.phone.trim()) errs.phone = 'Phone number is required'
    if (!formData.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email'
    }
    if (!formData.emergencyContact.trim()) errs.emergencyContact = 'Emergency contact is required'
    if (!formData.age.trim()) {
      errs.age = 'Age is required'
    } else if (isNaN(formData.age) || Number(formData.age) < 1) {
      errs.age = 'Enter a valid age'
    }
    if (!formData.bloodGroup.trim()) errs.bloodGroup = 'Blood group is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleBook = () => {
    if (trip.status === 'completed') return
    setStep('form')
  }

  const handleConfirmBooking = async () => {
    if (!validate()) return

    setSending(true)
    const toastId = toast.loading('Sending your booking...')

    try {
      const result = await sendBookingEmail({ user: formData, trip })
      toast.dismiss(toastId)

      if (result.success) {
        toast.success('Booking confirmed! Check your email 🎉', { duration: 5000 })
      } else {
        toast.success("Booking registered! We'll contact you shortly 🏕️", { duration: 5000 })
      }
      setStep('success')
    } catch {
      toast.dismiss(toastId)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleBackToDetails = () => {
    setStep('details')
    setErrors({})
  }

  // ─── Step: Success (confetti) ──────────────────────────
  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <Confetti
          width={windowSize.w}
          height={windowSize.h}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
          colors={['#4ecdc4', '#6ee7e0', '#ff8c42', '#f0f4ff', '#1e3058', '#FFD700']}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="modal-content booking-success-glow"
          style={{ maxWidth: '500px', textAlign: 'center' }}
        >
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="font-display text-2xl font-bold text-sc-light mb-3">
            Booking Confirmed!
          </h2>
          <p className="font-body text-sc-light/60 mb-2 leading-relaxed">
            Your booking for <span className="text-sc-teal font-semibold">{trip.name}</span> has been received.
          </p>
          <p className="font-body text-sc-light/40 text-sm mb-8">
            A confirmation email with all the details has been sent to <span className="text-sc-teal">{formData.email}</span>
          </p>

          {/* Booking summary card */}
          <div className="glass p-5 rounded-xl text-left mb-8">
            <h4 className="font-display text-sm font-bold text-sc-teal mb-3 tracking-wider">BOOKING SUMMARY</h4>
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-sc-light/40">Trip</span>
                <span className="text-sc-light">{trip.emoji} {trip.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sc-light/40">Date</span>
                <span className="text-sc-light">{trip.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sc-light/40">Price</span>
                <span className="text-sc-teal font-bold">{trip.price}</span>
              </div>
              <div className="h-px bg-sc-teal/10 my-2" />
              <div className="flex justify-between">
                <span className="text-sc-light/40">Traveler</span>
                <span className="text-sc-light">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sc-light/40">Email</span>
                <span className="text-sc-light">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sc-light/40">Phone</span>
                <span className="text-sc-light">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sc-light/40">Emergency Contact</span>
                <span className="text-sc-light">{formData.emergencyContact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sc-light/40">Age</span>
                <span className="text-sc-light">{formData.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sc-light/40">Blood Group</span>
                <span className="text-sc-light">{formData.bloodGroup}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-teal w-full py-3 text-sm">
            Done ✨
          </button>
        </motion.div>
      </motion.div>
    )
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

        <AnimatePresence mode="wait">
          {/* ─── Step: Details ──────────────────────────── */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
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
                  className={`flex-1 py-3 rounded-xl font-display font-bold tracking-wider text-sm transition-all duration-300 ${trip.status === 'completed'
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
          )}

          {/* ─── Step: Booking Form ──────────────────────── */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
            >
              {/* Trip summary bar */}
              <div className="glass p-4 rounded-xl mb-6 flex items-center gap-4">
                <div className="text-3xl">{trip.emoji}</div>
                <div className="flex-1">
                  <div className="font-display font-bold text-sc-light text-sm">{trip.name}</div>
                  <div className="font-body text-sc-light/40 text-xs">{trip.date} · {trip.price}</div>
                </div>
                <div className="text-sc-teal font-display font-bold text-lg">{trip.price}</div>
              </div>

              <h3 className="font-display text-lg font-bold text-sc-light mb-1">Complete Your Booking</h3>
              <p className="font-body text-sc-light/40 text-sm mb-6">Fill in your details to reserve your spot</p>

              {/* Form fields */}
              <div className="space-y-5">
                {/* Name */}
                <div className={errors.name ? 'booking-field-error' : ''}>
                  <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="sc-input"
                    disabled={sending}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs font-body mt-1.5">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className={errors.email ? 'booking-field-error' : ''}>
                  <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="sc-input"
                    disabled={sending}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs font-body mt-1.5">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className={errors.phone ? 'booking-field-error' : ''}>
                  <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="sc-input"
                    disabled={sending}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs font-body mt-1.5">{errors.phone}</p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className={errors.emergencyContact ? 'booking-field-error' : ''}>
                  <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                    Emergency Contact Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="sc-input"
                    disabled={sending}
                  />
                  {errors.emergencyContact && (
                    <p className="text-red-400 text-xs font-body mt-1.5">{errors.emergencyContact}</p>
                  )}
                </div>

                {/* Age & Blood Group row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Age */}
                  <div className={errors.age ? 'booking-field-error' : ''}>
                    <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                      Age <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="e.g. 25"
                      min="1"
                      className="sc-input"
                      disabled={sending}
                    />
                    {errors.age && (
                      <p className="text-red-400 text-xs font-body mt-1.5">{errors.age}</p>
                    )}
                  </div>

                  {/* Blood Group */}
                  <div className={errors.bloodGroup ? 'booking-field-error' : ''}>
                    <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                      Blood Group <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="sc-input"
                      disabled={sending}
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A−</option>
                      <option value="B+">B+</option>
                      <option value="B-">B−</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB−</option>
                      <option value="O+">O+</option>
                      <option value="O-">O−</option>
                    </select>
                    {errors.bloodGroup && (
                      <p className="text-red-400 text-xs font-body mt-1.5">{errors.bloodGroup}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                    Description <span className="text-sc-light/20">(optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Any dietary needs, medical conditions, or special requests..."
                    rows={3}
                    className="sc-input resize-none"
                    disabled={sending}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleConfirmBooking}
                  disabled={sending}
                  className={`flex-1 py-3 rounded-xl font-display font-bold tracking-wider text-sm transition-all duration-300 ${sending
                    ? 'bg-sc-slate/30 text-sc-light/30 cursor-not-allowed'
                    : 'btn-teal text-center'
                    }`}
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-sc-dark/30 border-t-sc-dark rounded-full inline-block"
                      />
                      Confirming...
                    </span>
                  ) : (
                    '✅ Confirm Booking'
                  )}
                </button>
                <button
                  onClick={handleBackToDetails}
                  disabled={sending}
                  className="btn-outline px-6 py-3 text-sm"
                >
                  ← Back
                </button>
              </div>

              <p className="text-sc-light/25 text-xs font-body text-center mt-4">
                You'll receive a confirmation email with the booking summary.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default TripModal
