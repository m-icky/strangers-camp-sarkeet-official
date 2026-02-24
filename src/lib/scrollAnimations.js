import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const initTextReveal = (elements, trigger) => {
  elements.forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: trigger || el,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  })
}

export const initParallax = (el, speed = 0.5) => {
  gsap.to(el, {
    yPercent: -30 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

export const initFadeIn = (elements, stagger = 0.15) => {
  gsap.from(elements, {
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: elements[0],
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  })
}

export const initPinSection = (trigger, endTrigger) => {
  ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: () => `+=${endTrigger.offsetHeight}`,
    pin: true,
    pinSpacing: false,
  })
}

export const initHorizontalScroll = (container) => {
  const panels = gsap.utils.toArray(container.querySelectorAll('.panel'))
  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (panels.length - 1),
      end: () => `+=${container.offsetWidth}`,
    },
  })
}
