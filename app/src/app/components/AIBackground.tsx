import React, { useState, useEffect } from 'react'

type Particle = {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

type Line = {
  id: number
  startId: number
  endId: number
  opacity: number
}

const AIAnimatedBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      const count = window.innerWidth < 768 ? 20 : 45

      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 200 - 50,
          y: Math.random() * 130 - 10,
          size: 0,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 1 + 1,
        })
      }

      setParticles(newParticles)
    }

    generateParticles()

    const handleResize = () => {
      generateParticles()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [lines, setLines] = useState<Line[]>([])

  useEffect(() => {
    const newLines: Line[] = []
    const connectionCount = particles.length // Half the lines (1x the number of particles)

    for (let i = 0; i < connectionCount; i++) {
      if (particles.length > 1) {
        const start = Math.floor(Math.random() * particles.length)
        let end = Math.floor(Math.random() * particles.length)

        while (end === start) {
          end = Math.floor(Math.random() * particles.length)
        }

        newLines.push({
          id: i,
          startId: start,
          endId: end,
          opacity: Math.random() * 0.2 + 0.05,
        })
      }
    }

    setLines(newLines)
  }, [particles])

  return (
    <div className='fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0'>
      <div className='absolute inset-0 opacity-70' />

      <svg className='absolute inset-0 w-full h-full'>
        {lines.map((line) => {
          const startParticle = particles[line.startId]
          const endParticle = particles[line.endId]

          if (!startParticle || !endParticle) return null

          return (
            <line
              key={line.id}
              x1={`${startParticle.x}%`}
              y1={`${startParticle.y}%`}
              x2={`${endParticle.x}%`}
              y2={`${endParticle.y}%`}
              stroke='#FFFFFF'
              strokeWidth='0.5'
              strokeOpacity={line.opacity}
              style={{
                animation: `line-pulse ${
                  Math.random() * 5 + 4
                }s infinite alternate`,
              }}
            />
          )
        })}
      </svg>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className='absolute rounded-full animate-pulse'
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: '#000000',
            opacity: particle.opacity,
            animation: `pulse ${particle.speed}s infinite alternate, float-${
              particle.id
            } ${particle.speed * 2}s infinite alternate ease-in-out`,
          }}
        />
      ))}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(0.8); opacity: 0.3; }
        }
        
        @keyframes line-pulse {
          0% { stroke-opacity: 0.1; }
          50% { stroke-opacity: 0.7; } /* Increased opacity for more visibility */
          100% { stroke-opacity: 0.1; }
        }
        
        ${particles
          .map(
            (particle) => `
          @keyframes float-${particle.id} {
            0% { transform: translate(0, 0); }
            100% { transform: translate(${Math.random() * 20 - 10}px, ${
              Math.random() * 20 - 10
            }px); }
          }
        `
          )
          .join('\n')}
      `}</style>
    </div>
  )
}

export default AIAnimatedBackground
