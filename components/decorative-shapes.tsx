"use client"

import { motion } from "framer-motion"

export function DecorativeShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid Pattern - Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: -30 }}
        animate={{ opacity: 0.12, x: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute top-0 left-0 w-64 h-64"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-tl" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2.5" fill="currentColor" className="text-white" opacity="0.8" />
              <circle cx="15" cy="15" r="1.5" fill="currentColor" className="text-white" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-tl)" />
        </svg>
      </motion.div>

      {/* Animated Grid Pattern - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 30 }}
        animate={{ opacity: 0.12, x: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute bottom-0 right-0 w-64 h-64 hidden md:block"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-br" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2.5" fill="currentColor" className="text-white" opacity="0.8" />
              <circle cx="15" cy="15" r="1.5" fill="currentColor" className="text-white" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-br)" />
        </svg>
      </motion.div>

      {/* Hexagon Pattern - Top Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="absolute top-20 right-20 w-48 h-48 hidden lg:block"
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-white" opacity="0.6" />
          <path d="M50 15 L78.3 31.25 L78.3 68.75 L50 85 L21.7 68.75 L21.7 31.25 Z" stroke="currentColor" strokeWidth="1" fill="none" className="text-white" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Large Pulsing Gradient Blob */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 180, 360],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]"
      >
        <svg viewBox="0 0 700 700" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M350,100 C450,100 600,150 600,300 C600,450 500,600 350,600 C200,600 100,500 100,350 C100,200 250,100 350,100 Z"
            fill="currentColor"
            className="text-white"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Geometric Cubes - Left */}
      <motion.div
        animate={{
          y: [0, -40, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute left-10 top-1/3 w-24 h-24 opacity-10 hidden lg:block"
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" stroke="currentColor" strokeWidth="2" fill="none" className="text-white" />
          <path d="M50 10 L50 50 M50 50 L10 70 M50 50 L90 70" stroke="currentColor" strokeWidth="1.5" className="text-white" opacity="0.5" />
        </svg>
      </motion.div>

      {/* Floating Rings - Top Center */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-28 left-1/2 -translate-x-1/2 w-40 h-40 opacity-10 hidden xl:block"
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" className="text-white" />
          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-white" opacity="0.6" />
          <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1" fill="none" className="text-white" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Abstract Lines Network - Right Side */}
      <motion.div
        animate={{
          opacity: [0.08, 0.15, 0.08],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute right-0 top-1/4 w-48 h-96 hidden lg:block"
      >
        <svg width="100%" height="100%" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
          <path d="M 200 0 L 150 100 L 200 200 L 150 300 L 200 400" stroke="currentColor" strokeWidth="2" fill="none" className="text-white" opacity="0.6" />
          <path d="M 180 50 L 130 150 L 180 250 L 130 350" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-white" opacity="0.4" />
          <circle cx="150" cy="100" r="4" fill="currentColor" className="text-white" />
          <circle cx="200" cy="200" r="4" fill="currentColor" className="text-white" />
          <circle cx="150" cy="300" r="4" fill="currentColor" className="text-white" />
        </svg>
      </motion.div>

      {/* Spiral Pattern - Bottom Left */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute bottom-24 left-12 w-32 h-32 opacity-10 hidden lg:block"
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 50 50 Q 50 30 70 30 Q 90 30 90 50 Q 90 80 60 80 Q 20 80 20 50 Q 20 10 60 10" stroke="currentColor" strokeWidth="2" fill="none" className="text-white" />
        </svg>
      </motion.div>

      {/* Floating Particles */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-1/3 w-3 h-3 rounded-full bg-white opacity-20 hidden lg:block"
      />
      <motion.div
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/3 left-1/4 w-4 h-4 rounded-full bg-white opacity-15 hidden lg:block"
      />
      <motion.div
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-white opacity-25 hidden lg:block"
      />

      {/* Molecular Structure - Bottom Right */}
      <motion.div
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute bottom-32 right-32 w-40 h-40 opacity-12 hidden xl:block"
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <line x1="50" y1="50" x2="80" y2="30" stroke="currentColor" strokeWidth="1" className="text-white" opacity="0.5" />
          <line x1="50" y1="50" x2="80" y2="70" stroke="currentColor" strokeWidth="1" className="text-white" opacity="0.5" />
          <line x1="50" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="1" className="text-white" opacity="0.5" />
          <circle cx="50" cy="50" r="5" fill="currentColor" className="text-white" />
          <circle cx="80" cy="30" r="4" fill="currentColor" className="text-white" />
          <circle cx="80" cy="70" r="4" fill="currentColor" className="text-white" />
          <circle cx="20" cy="50" r="4" fill="currentColor" className="text-white" />
        </svg>
      </motion.div>
    </div>
  )
}

