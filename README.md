# 🏕️ Stranger's Camp

> **Meet Strangers. Travel Together. Become Stories.**

A visually immersive landing page for **Stranger's Camp** by [sarkeet.official](https://www.instagram.com/sarkeet.official/) — a community-driven travel experience that brings strangers together on unforgettable trips.

---

## ✨ Features

- **3D Hero Scene** — Interactive Three.js-powered hero with animated particles and dynamic lighting
- **Parallax Scrolling** — Multi-layered parallax scene for depth and immersion
- **Physics Lanyard Badge** — Draggable, physics-based identity badge with spring animations
- **Aurora Background** — Animated aurora borealis canvas effect
- **Smooth Animations** — Scroll-triggered and page-transition animations via Framer Motion & GSAP
- **Trip Listings** — Browse upcoming trips with detailed modal views
- **Photo Gallery** — Curated gallery showcasing past adventures
- **Traveller Reviews** — Social proof from the community
- **Contact Form** — EmailJS-powered contact form with toast notifications
- **Scroll Progress Bar** — Visual indicator of page scroll position
- **Animated Loader** — Polished loading screen on initial visit
- **Fully Responsive** — Designed to look great on all screen sizes

---

## 🛠️ Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| **Framework**| [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) |
| **3D**       | [Three.js](https://threejs.org/)                            |
| **Animation**| [Framer Motion](https://www.framer.com/motion/) · [GSAP](https://gsap.com/) |
| **Styling**  | [Tailwind CSS 3](https://tailwindcss.com/) + custom CSS     |
| **Email**    | [EmailJS](https://www.emailjs.com/)                         |
| **Toasts**   | [React Hot Toast](https://react-hot-toast.com/)             |
| **Fonts**    | Cinzel · Raleway · Playfair Display (Google Fonts)          |

---

## 📁 Project Structure

```
stranger-camp/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/              # Static assets
│   ├── components/
│   │   ├── About.jsx        # About section
│   │   ├── Aurora.jsx        # Aurora borealis canvas effect
│   │   ├── ContactForm.jsx   # EmailJS contact form
│   │   ├── Footer.jsx        # Site footer
│   │   ├── Gallery.jsx       # Photo gallery
│   │   ├── Hero3DScene.jsx   # Three.js 3D hero scene
│   │   ├── Lanyard.jsx       # Physics-based draggable badge
│   │   ├── Loader.jsx        # Animated loading screen
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── ParallaxScene.jsx # Parallax layered scene
│   │   ├── Reviews.jsx       # Traveller reviews
│   │   ├── TripModal.jsx     # Trip detail modal
│   │   └── Trips.jsx         # Trip listings
│   ├── lib/
│   │   ├── emailjs.js        # EmailJS configuration
│   │   └── scrollAnimations.js # Scroll animation utilities
│   ├── pages/
│   │   └── Home.jsx          # Main page layout
│   ├── App.jsx               # Root component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/stranger-camp.git
cd stranger-camp

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview    # Preview the production build locally
```

---

## 🎨 Design System

The project uses a custom Tailwind CSS color palette:

| Token              | Hex       | Usage                  |
| ------------------ | --------- | ---------------------- |
| `sc-dark`          | `#0f1b35` | Primary background     |
| `sc-navy`          | `#1e3058` | Secondary background   |
| `sc-slate`         | `#3d6080` | Muted elements         |
| `sc-teal`          | `#4ecdc4` | Primary accent         |
| `sc-teal-bright`   | `#6ee7e0` | Highlight accent       |
| `sc-light`         | `#f0f4ff` | Light text / surfaces  |
| `sc-muted`         | `#a8b8d8` | Muted text             |
| `sc-accent`        | `#ff8c42` | CTA / warm accent      |

**Typography:** Cinzel (display), Raleway (body), Playfair Display (accents)

---

## 📧 Email Configuration

The contact form uses [EmailJS](https://www.emailjs.com/). To configure:

1. Create a free account at [emailjs.com](https://www.emailjs.com/)
2. Set up a service and email template
3. Update credentials in `src/lib/emailjs.js`

---

## 📄 License

This project is private. All rights reserved.

---

<p align="center">
  Made with ❤️ by <strong>sarkeet.official</strong>
</p>
