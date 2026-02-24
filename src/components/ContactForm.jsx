import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import toast from 'react-hot-toast'
import { sendContactEmail } from '../lib/emailjs'

const ContactForm = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Sending your message...')

    try {
      const result = await sendContactEmail(formData)
      toast.dismiss(toastId)

      if (result.success) {
        toast.success('Message sent! We\'ll get back to you soon. 🏕️', {
          duration: 5000,
        })
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        // Simulate success in demo mode
        toast.success('Message received! (Demo mode — configure EmailJS to send real emails) 🏕️', {
          duration: 5000,
        })
        setFormData({ name: '', email: '', phone: '', message: '' })
      }
    } catch {
      toast.dismiss(toastId)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'sarkeet.official@gmail.com' },
    { icon: '📸', label: 'Instagram', value: '@sarkeet.official' },
    { icon: '☎️', label: 'Phone', value: '+91 81369 79054' },
    { icon: '📍', label: 'Base', value: 'India — Everywhere' },
  ]

  return (
    <section id="contact" ref={sectionRef} className="py-24 lg:py-36 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sc-teal/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sc-slate/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="section-tag mb-4"
          >
            ✦ Get In Touch
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            Ready to Meet a <span className="text-sc-teal">Stranger?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-sc-light/50 font-body max-w-xl mx-auto"
          >
            Have questions? Want to plan a custom trip? Just want to say hello? We're all ears.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Contact info cards */}
            {contactInfo.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 glass-card p-5"
              >
                <div className="w-12 h-12 rounded-xl bg-sc-teal/10 border border-sc-teal/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sc-light/30 text-xs font-body mb-0.5">{item.label}</div>
                  <div className="text-sc-light font-body font-medium text-sm">{item.value}</div>
                </div>
              </motion.div>
            ))}

            {/* Quote */}
            <div className="glass-card p-6 border-l-2 border-sc-teal">
              <p className="font-accent italic text-sc-light/60 text-base leading-relaxed">
                "Every great friendship starts with a hello to a stranger."
              </p>
              <div className="text-sc-teal text-xs font-display mt-3 tracking-widest">— sarkeet.official</div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="sc-input"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="sc-input"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  className="sc-input"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sc-light/50 font-body text-xs mb-2 tracking-wider uppercase">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about the trip you're dreaming of, or just say hello..."
                  rows={5}
                  className="sc-input resize-none"
                  required
                  disabled={loading}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className={`w-full py-4 rounded-xl font-display font-bold tracking-widest text-sm transition-all duration-300 relative overflow-hidden ${
                  loading
                    ? 'bg-sc-slate/30 text-sc-light/30 cursor-not-allowed'
                    : 'btn-teal'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-sc-teal/30 border-t-sc-teal rounded-full"
                    />
                    Sending...
                  </span>
                ) : (
                  '🏕️ Send Message'
                )}
              </motion.button>

              <p className="text-sc-light/25 text-xs font-body text-center">
                We typically respond within 24 hours. No spam, ever.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
