import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Loader from './components/Loader'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Scroll progress bar
  useEffect(() => {
    const bar = document.getElementById('scroll-progress')
    const onScroll = () => {
      if (!bar) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      bar.style.width = `${progress}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div id="scroll-progress" />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1C2541',
            color: '#EAEAEA',
            border: '1px solid rgba(91,192,190,0.3)',
            borderRadius: '12px',
            fontFamily: 'Raleway, sans-serif',
          },
        }}
      />
      {loading ? <Loader /> : <Home />}
    </>
  )
}

export default App
