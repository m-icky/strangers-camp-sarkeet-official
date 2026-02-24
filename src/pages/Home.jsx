import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Hero3DScene from '../components/Hero3DScene'
import About from '../components/About'
import ParallaxScene from '../components/ParallaxScene'
import Trips from '../components/Trips'
import Reviews from '../components/Reviews'
import Gallery from '../components/Gallery'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import Lanyard from '../components/Lanyard'

const SectionDivider = () => (
  <div className="section-divider my-0" />
)

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar />

      {/* Lanyard – physics badge fixed top-right below navbar */}
      <Lanyard />

      {/* Hero with 3D Three.js */}
      <Hero3DScene />

      {/* About */}
      <About />

      <SectionDivider />

      {/* Parallax Layered Scene */}
      <ParallaxScene />

      <SectionDivider />

      {/* Trips section */}
      <Trips />

      <SectionDivider />

      {/* Gallery */}
      <Gallery />

      <SectionDivider />

      {/* Reviews */}
      <Reviews />

      <SectionDivider />

      {/* Contact */}
      <ContactForm />

      {/* Footer */}
      <Footer />
    </motion.div>
  )
}

export default Home
