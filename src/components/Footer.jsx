import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="relative border-t border-sc-teal/10 py-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-sc-teal/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold text-sc-light mb-2 tracking-widest">
              STRANGER'S CAMP
            </h3>
            <p className="text-sc-teal text-xs font-body tracking-[0.3em] mb-4">by sarkeet.official</p>
            <p className="font-body text-sc-light/40 text-sm leading-relaxed">
              Where strangers become stories. Join the community that travels together and grows together.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-sm font-bold text-sc-teal mb-4 tracking-widest">EXPLORE</h4>
            <ul className="space-y-2">
              {['About', 'Trips', 'Gallery', 'Reviews', 'Contact'].map(link => (
                <li key={link}>
                  <button
                    onClick={() => document.querySelector(`#${link.toLowerCase()}`).scrollIntoView({ behavior: 'smooth' })}
                    className="font-body text-sc-light/40 hover:text-sc-teal text-sm transition-colors"
                  >
                    → {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display text-sm font-bold text-sc-teal mb-4 tracking-widest">CONNECT</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:sarkeet.official@gmail.com" className="font-body text-sc-light/40 hover:text-sc-teal text-sm transition-colors">
                  📧 sarkeet.official@gmail.com
                </a>
              </li>
              <li>
                <span className="font-body text-sc-light/40 text-sm">
                  📸 @sarkeet.official
                </span>
              </li>
              <li>
                <span className="font-body text-sc-light/40 text-sm">
                  ☎️ +91 81369 79054
                </span>
              </li>
              <li>
                <span className="font-body text-sc-light/40 text-sm">
                  📍 India — Everywhere
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Bottom bar */}
        <div className="mt-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-sc-light/25 text-xs">
            © 2026 Stranger's Camp by sarkeet.official. All rights reserved.
          </p>
          <p className="font-body text-sc-light/25 text-xs">
            Made with ❤️ by Mack's.Studio
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
