import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Aurora from './Aurora'
import Mainlogo from '../assets/Sarkeet.png'

gsap.registerPlugin(ScrollTrigger)

const taglineWords = ['Meet', 'Strangers.', 'Travel', 'Together.', 'Become', 'Stories.']

// ─── Realistic campfire builder ───────────────────────────────────────────────
function buildCampfire() {
  const group = new THREE.Group()

  // ---- Stone ring ----
  const stoneMat = new THREE.MeshLambertMaterial({ color: 0x555555 })
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2
    const stoneGeo = new THREE.SphereGeometry(0.18 + Math.random() * 0.07, 6, 5)
    const stone = new THREE.Mesh(stoneGeo, stoneMat)
    stone.position.set(Math.cos(angle) * 0.78, 0.1, Math.sin(angle) * 0.78)
    stone.scale.y = 0.55
    group.add(stone)
  }

  // ---- Logs ----
  const logMat  = new THREE.MeshLambertMaterial({ color: 0x6b3a1f })
  const charMat = new THREE.MeshLambertMaterial({ color: 0x1a0c06 })
  const logAngles = [0, Math.PI / 2.5, Math.PI / 1.2]
  logAngles.forEach((angle) => {
    const logGeo = new THREE.CylinderGeometry(0.11, 0.14, 1.7, 8)
    const log = new THREE.Mesh(logGeo, logMat)
    log.rotation.z = Math.PI / 2
    log.rotation.y = angle
    log.position.set(Math.cos(angle) * 0.25, 0.09, Math.sin(angle) * 0.25)
    group.add(log)
    // Charred tip
    const charGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8)
    const char = new THREE.Mesh(charGeo, charMat)
    char.rotation.z = Math.PI / 2
    char.rotation.y = angle
    char.position.copy(log.position)
    group.add(char)
  })

  // ---- Ash bed ----
  const ashMesh = new THREE.Mesh(
    new THREE.CircleGeometry(0.62, 14),
    new THREE.MeshBasicMaterial({ color: 0x2a1808 })
  )
  ashMesh.rotation.x = -Math.PI / 2
  ashMesh.position.y = 0.02
  group.add(ashMesh)

  // ---- Glowing coals ----
  const coalColors = [0xff3300, 0xff5500, 0xff7700, 0xff9900, 0xcc2200]
  for (let i = 0; i < 16; i++) {
    const r = Math.random() * 0.48
    const a = Math.random() * Math.PI * 2
    const coalGeo = new THREE.CircleGeometry(0.045 + Math.random() * 0.065, 6)
    const coalMat = new THREE.MeshBasicMaterial({
      color: coalColors[i % coalColors.length],
      transparent: true,
      opacity: 0.75 + Math.random() * 0.25,
    })
    const coal = new THREE.Mesh(coalGeo, coalMat)
    coal.rotation.x = -Math.PI / 2
    coal.position.set(Math.cos(a) * r, 0.035, Math.sin(a) * r)
    group.add(coal)
  }

  // ---- Flame layers (cone stack with additive blending) ----
  const flameLayers = []
  const flameConfigs = [
    // outer, wide, dark red-orange
    { r: 0.42, h: 1.6,  color: 0xff1a00, op: 0.82, y: 0.80, segs: 10 },
    { r: 0.32, h: 1.35, color: 0xff4400, op: 0.80, y: 0.88, segs: 10 },
    { r: 0.24, h: 1.1,  color: 0xff6600, op: 0.76, y: 0.95, segs: 9  },
    { r: 0.17, h: 0.88, color: 0xff8800, op: 0.72, y: 1.00, segs: 8  },
    { r: 0.11, h: 0.68, color: 0xffaa00, op: 0.68, y: 1.06, segs: 7  },
    { r: 0.07, h: 0.48, color: 0xffcc22, op: 0.60, y: 1.12, segs: 6  },
    // bright core
    { r: 0.035, h: 0.30, color: 0xffffff, op: 0.50, y: 1.18, segs: 5  },
  ]

  flameConfigs.forEach((cfg, idx) => {
    const geo = new THREE.ConeGeometry(cfg.r, cfg.h, cfg.segs, 1, true)
    const mat = new THREE.MeshBasicMaterial({
      color: cfg.color,
      transparent: true,
      opacity: cfg.op,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const cone = new THREE.Mesh(geo, mat)
    cone.position.set(
      (Math.random() - 0.5) * 0.07,
      cfg.y,
      (Math.random() - 0.5) * 0.07
    )
    cone.userData = {
      baseOp: cfg.op,
      baseY:  cfg.y,
      phase:  idx * 0.85 + Math.random() * 0.5,
      freqY:  2.2 + idx * 0.45,
      freqS:  1.6 + idx * 0.35,
    }
    group.add(cone)
    flameLayers.push(cone)
  })

  // ---- Spark / ember particle system ----
  const SPARK_N = 120
  const sPos   = new Float32Array(SPARK_N * 3)
  const sVel   = []
  const sLife  = new Float32Array(SPARK_N)
  const sMaxL  = new Float32Array(SPARK_N)

  const resetSpark = (i) => {
    const a = Math.random() * Math.PI * 2
    const r = Math.random() * 0.35
    sPos[i * 3]     = Math.cos(a) * r
    sPos[i * 3 + 1] = 0.5 + Math.random() * 0.5
    sPos[i * 3 + 2] = Math.sin(a) * r
    sVel[i] = {
      x: (Math.random() - 0.5) * 0.035,
      y: 0.045 + Math.random() * 0.07,
      z: (Math.random() - 0.5) * 0.035,
    }
    sLife[i]  = 0
    sMaxL[i]  = 0.5 + Math.random() * 1.4
  }
  for (let i = 0; i < SPARK_N; i++) {
    resetSpark(i)
    sLife[i] = Math.random() * sMaxL[i]
  }

  const sparkGeo = new THREE.BufferGeometry()
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
  const sparkMat = new THREE.PointsMaterial({
    color: 0xff8800,
    size: 0.065,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const sparks = new THREE.Points(sparkGeo, sparkMat)
  group.add(sparks)

  // ---- Ground ember glow disc ----
  const glowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 1.4),
    new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
  )
  glowMesh.rotation.x = -Math.PI / 2
  glowMesh.position.y = 0.04
  group.add(glowMesh)

  // ---- Smoke puffs ----
  const smokePuffs = []
  for (let i = 0; i < 7; i++) {
    const puffMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.15 + Math.random() * 0.15, 6, 6),
      new THREE.MeshBasicMaterial({
        color: 0x777777,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    )
    puffMesh.userData = {
      life:  Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      ox: (Math.random() - 0.5) * 0.35,
    }
    puffMesh.position.set(puffMesh.userData.ox, 1.7 + i * 0.5, 0)
    group.add(puffMesh)
    smokePuffs.push(puffMesh)
  }

  group.position.set(0, 0, 10)

  // ---- Per-frame update ----
  let tick = 0
  const update = (dt, scrollProg = 0) => {
    tick += dt
    const intensity = 1 + scrollProg * 2.8 // fire grows with scroll!

    // Animate each flame cone
    flameLayers.forEach((cone) => {
      const { baseOp, baseY, phase, freqY, freqS } = cone.userData
      const f1 = Math.sin(tick * freqY + phase)
      const f2 = Math.cos(tick * freqS * 1.4 + phase * 1.8)
      cone.scale.y = (1 + f1 * 0.22 + f2 * 0.1) * intensity
      cone.scale.x = 1 + f2 * 0.12
      cone.scale.z = 1 + f1 * 0.12
      cone.position.y = baseY * intensity + f1 * 0.06
      cone.rotation.y += 0.012
      cone.material.opacity = Math.max(0.2, baseOp * (0.88 + f1 * 0.12))
    })

    // Update spark particles
    for (let i = 0; i < SPARK_N; i++) {
      sLife[i] += dt
      if (sLife[i] > sMaxL[i]) { resetSpark(i); continue }
      sPos[i * 3]     += sVel[i].x * intensity
      sPos[i * 3 + 1] += sVel[i].y * intensity
      sPos[i * 3 + 2] += sVel[i].z * intensity
      sVel[i].x *= 0.982
      sVel[i].z *= 0.982
      // Cool falling embers: after halfway, start falling back
      if (sLife[i] > sMaxL[i] * 0.6) sVel[i].y -= 0.002
    }
    sparkGeo.attributes.position.needsUpdate = true
    sparkMat.size = 0.055 + Math.sin(tick * 4) * 0.015

    // Ember glow pulse
    glowMesh.material.opacity = (0.12 + Math.sin(tick * 2.8) * 0.07) * Math.min(2.5, intensity)
    glowMesh.scale.set(
      1 + Math.sin(tick * 2.1) * 0.12,
      1,
      1 + Math.cos(tick * 1.8) * 0.1
    )

    // Smoke puffs
    smokePuffs.forEach((puff) => {
      puff.userData.life += puff.userData.speed
      if (puff.userData.life > 1) {
        puff.userData.life = 0
        puff.position.set(puff.userData.ox, 1.7 + Math.random() * 0.4, 0)
        puff.scale.setScalar(0.4)
      }
      const t = puff.userData.life
      puff.position.y += 0.008
      puff.position.x += (Math.random() - 0.5) * 0.0015
      puff.scale.setScalar(0.4 + t * 2)
      puff.material.opacity = t < 0.3 ? t * 0.12 : (1 - t) * 0.07
    })
  }

  return { group, update }
}

// ─── Main Component ────────────────────────────────────────────────────────────
const Hero3DScene = () => {
  const canvasRef = useRef(null)
  const frameRef  = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0c1828)
    scene.fog = new THREE.FogExp2(0x0c1828, 0.026)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      58, canvas.clientWidth / canvas.clientHeight, 0.1, 1000
    )
    camera.position.set(0, 5, 30)
    camera.lookAt(0, 2, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25

    // Lighting
    const ambient = new THREE.AmbientLight(0x1a2d5a, 2.8)
    scene.add(ambient)

    const moonLight = new THREE.DirectionalLight(0x4488bb, 1.3)
    moonLight.position.set(-12, 22, 8)
    moonLight.castShadow = true
    scene.add(moonLight)

    // Main campfire light
    const fireLight = new THREE.PointLight(0xff5500, 7, 24)
    fireLight.position.set(0, 2.2, 10)
    scene.add(fireLight)
    // Softer fill
    const fireFill = new THREE.PointLight(0xff9900, 3.5, 18)
    fireFill.position.set(0, 0.6, 10)
    scene.add(fireFill)
    // Blue rim from moon on tent side
    const rimLight = new THREE.PointLight(0x3355aa, 1.5, 18)
    rimLight.position.set(-8, 3, 6)
    scene.add(rimLight)

    // Terrain
    const terrainGeo = new THREE.PlaneGeometry(160, 160, 80, 80)
    const tPos = terrainGeo.attributes.position
    for (let i = 0; i < tPos.count; i++) {
      const x = tPos.getX(i), y = tPos.getY(i)
      let z = 0
      if (y < -8) {
        z = Math.sin(x * 0.09) * 10 + Math.cos(x * 0.06) * 7 + Math.abs(y) * 0.35
        z += Math.sin(x * 0.17 + 1.3) * 4.5
      } else if (y < 0) {
        z = Math.sin(x * 0.13) * 2.5 - y * 0.07
      }
      z += (Math.random() - 0.5) * 0.35
      tPos.setZ(i, z)
    }
    terrainGeo.computeVertexNormals()
    const terrain = new THREE.Mesh(
      terrainGeo,
      new THREE.MeshLambertMaterial({ color: 0x182a38 })
    )
    terrain.rotation.x = -Math.PI / 2
    terrain.receiveShadow = true
    scene.add(terrain)

    // Stars
    const starCount = 2800
    const sBuf = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      sBuf[i * 3]     = (Math.random() - 0.5) * 400
      sBuf[i * 3 + 1] = Math.random() * 130 + 14
      sBuf[i * 3 + 2] = (Math.random() - 0.5) * 400
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(sBuf, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xddeeff, size: 0.32, sizeAttenuation: true,
      transparent: true, opacity: 0.95,
    })
    scene.add(new THREE.Points(starGeo, starMat))

    // Moon + halo
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(5, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xbbcce8 })
    )
    moon.position.set(-40, 50, -90)
    scene.add(moon)
    const moonHalo = new THREE.Mesh(
      new THREE.SphereGeometry(7.5, 14, 14),
      new THREE.MeshBasicMaterial({ color: 0x3366bb, transparent: true, opacity: 0.07, side: THREE.BackSide })
    )
    moon.add(moonHalo)

    // Tent
    const tentG = new THREE.Group()
    const tMat  = new THREE.MeshLambertMaterial({ color: 0x234568, side: THREE.DoubleSide })
    const tDark = new THREE.MeshLambertMaterial({ color: 0x142840 })
    const tBody = new THREE.Mesh(new THREE.ConeGeometry(3, 4.5, 4), tMat)
    tBody.position.set(-4, 2.25, 7); tBody.rotation.y = Math.PI / 4
    tBody.castShadow = true; tentG.add(tBody)
    const tDoor = new THREE.Mesh(new THREE.ConeGeometry(1, 2.6, 3), tDark)
    tDoor.position.set(-4, 1.2, 9.7); tDoor.rotation.y = Math.PI / 4; tentG.add(tDoor)
    const tFloor = new THREE.Mesh(
      new THREE.CircleGeometry(3, 4),
      new THREE.MeshLambertMaterial({ color: 0x0e1e30 })
    )
    tFloor.rotation.x = -Math.PI / 2; tFloor.rotation.z = Math.PI / 4
    tFloor.position.set(-4, 0.04, 7); tentG.add(tFloor)
    // Guy ropes
    const ropeMat = new THREE.LineBasicMaterial({ color: 0x607080 })
    ;[[-6, 3], [5, 3]].forEach(([rx, rz]) => {
      const pts = [new THREE.Vector3(-4, 4.5, 7), new THREE.Vector3(-4 + rx, 0.1, 7 + rz)]
      tentG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ropeMat))
    })
    scene.add(tentG)

    // Trees
    const treePairs = [
      [-9,5],[-14,2],[9,6],[14,3],[-17,8],[17,7],[-6,13],[7,14],[-22,0],[22,1]
    ]
    treePairs.forEach(([x, z]) => {
      const h = 3.5 + Math.random() * 2.2
      const tr = new THREE.Mesh(
        new THREE.ConeGeometry(1.3, h, 7),
        new THREE.MeshLambertMaterial({ color: 0x182a20 })
      )
      tr.position.set(x, h / 2, z); tr.castShadow = true; scene.add(tr)
      const trk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.26, 1.8, 6),
        new THREE.MeshLambertMaterial({ color: 0x3a1e0a })
      )
      trk.position.set(x, 0.9, z); scene.add(trk)
    })

    // Clouds
    const cloudG = new THREE.Group()
    const cMat   = new THREE.MeshLambertMaterial({ color: 0x3a5580, transparent: true, opacity: 0.35 })
    for (let i = 0; i < 10; i++) {
      const cc = new THREE.Group()
      for (let j = 0; j < 5; j++) {
        const cp = new THREE.Mesh(new THREE.SphereGeometry(1, 7, 7), cMat)
        cp.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 2)
        cp.scale.setScalar(Math.random() * 1.8 + 0.7); cc.add(cp)
      }
      cc.position.set((Math.random() - 0.5) * 110, Math.random() * 18 + 16, (Math.random() - 0.5) * 55 - 10)
      cloudG.add(cc)
    }
    scene.add(cloudG)

    // Campfire
    const { group: fireGroup, update: updateFire } = buildCampfire()
    scene.add(fireGroup)

    // ─── Scroll progress ────────────────────────────────────────────────────
    let scrollProg = 0
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => { scrollProg = self.progress },
    })

    // Camera flies toward campfire on scroll
    gsap.to(camera.position, {
      z: 4,
      y: 2,
      x: 0,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    // ─── Render loop ────────────────────────────────────────────────────────
    let lastNow = performance.now()

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      const now = performance.now()
      const dt  = Math.min((now - lastNow) / 1000, 0.05) // cap dt
      lastNow   = now
      const t   = now * 0.001

      // Campfire
      updateFire(dt, scrollProg)

      // Fire lights flicker
      const flk  = Math.sin(t * 8.1) * 0.5 + Math.sin(t * 15.3) * 0.25 + Math.sin(t * 23.7) * 0.1
      const base = 1 + scrollProg * 3.5
      fireLight.intensity = (5.5 + flk * 2) * base
      fireFill.intensity  = (3   + flk * 1) * base
      fireLight.position.x = Math.sin(t * 5) * 0.18
      fireLight.position.z = 10 + Math.cos(t * 3.7) * 0.12

      // Cloud drift
      cloudG.children.forEach((c, i) => {
        c.position.x += 0.007 * (i % 2 === 0 ? 1 : -1)
        if (c.position.x >  60) c.position.x = -60
        if (c.position.x < -60) c.position.x =  60
      })

      // Star twinkle
      starMat.opacity = 0.8 + Math.sin(t * 0.35) * 0.15

      // Tent sway
      tentG.rotation.y = Math.sin(t * 0.22) * 0.012

      // Camera look-at slowly drops toward fire
      camera.lookAt(0, Math.max(0.3, 2.5 - scrollProg * 2.2), 5)

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* Aurora night sky — deepest background layer */}
      <Aurora className="z-0" />

      {/* Three.js canvas — screened on top of aurora */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, mixBlendMode: 'screen', opacity: 0.80 }}
      />

      {/* DOM campfire glow bloom */}
      <div className="campfire-glow" />

      {/* Lighter overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1828]/25 via-transparent to-[#0c1828]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c1828]/20 via-transparent to-[#0c1828]/20" />
      <div className="noise-overlay" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <img src={Mainlogo} alt="Mainlogo" className="mb-6" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="section-tag mb-6"
        >
          ⛺ sarkeet.official presents
        </motion.div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-black leading-tight mb-6">
          {taglineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.8 + i * 0.2, duration: 0.6, ease: 'easeOut' }}
              className={`inline-block mr-3 drop-shadow-lg ${
                i === 1 || i === 3 || i === 5 ? 'text-[#4ecdc4]' : 'text-[#f0f4ff]'
              }`}
              style={i % 2 === 1 ? { textShadow: '0 0 30px rgba(78,205,196,0.5)' } : { textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="font-accent italic text-[#c0d8f8] text-lg sm:text-xl max-w-xl mb-10"
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}
        >
          Where every stranger is a story waiting to be told.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            className="btn-teal text-base"
            onClick={() => document.querySelector('#trips').scrollIntoView({ behavior: 'smooth' })}
          >
            🏕️ Explore Trips
          </button>
          <button
            className="btn-outline text-base"
            onClick={() => document.querySelector('#about').scrollIntoView({ behavior: 'smooth' })}
          >
            Our Story →
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-8 sm:gap-16"
        >
          {[
            { num: '500+', label: 'Strangers Met' },
            { num: '80+',  label: 'Trips Completed' },
            { num: '25+',  label: 'Destinations' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="font-display text-2xl sm:text-3xl font-bold text-[#4ecdc4]"
                style={{ textShadow: '0 0 24px rgba(78,205,196,0.7)' }}
              >
                {stat.num}
              </div>
              <div className="font-body text-xs text-[#8ab0d0] tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        {/* <span className="font-body text-xs text-[#4ecdc4]/80 tracking-[0.3em]">SCROLL</span> */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-[#4ecdc4] to-transparent"
        />
      </motion.div>
    </section>
  )
}

export default Hero3DScene
