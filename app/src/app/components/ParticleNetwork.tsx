'use client'

import { useEffect, useRef } from 'react'

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  alpha: number
  phase: number
  type?: string
}

export const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let can_w = window.innerWidth
    let can_h = window.innerHeight

    canvas.width = can_w
    canvas.height = can_h

    const BALL_NUM = 40
    const R = 2
    let balls: Ball[] = []
    const alpha_f = 0.03
    const link_line_width = 0.8
    const dis_limit = 260
    const mouse_ball: Ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      alpha: 1,
      phase: 0,
      type: 'mouse',
    }

    function getRandomSpeed(pos: string): [number, number] {
      const min = -1
      const max = 1
      switch (pos) {
        case 'top':
          return [randomNumFrom(min, max), randomNumFrom(0.1, max)]
        case 'right':
          return [randomNumFrom(min, -0.1), randomNumFrom(min, max)]
        case 'bottom':
          return [randomNumFrom(min, max), randomNumFrom(min, -0.1)]
        case 'left':
          return [randomNumFrom(0.1, max), randomNumFrom(min, max)]
        default:
          return [0, 0]
      }
    }

    function randomArrayItem<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)]
    }

    function randomNumFrom(min: number, max: number): number {
      return Math.random() * (max - min) + min
    }

    function randomSidePos(length: number): number {
      return Math.ceil(Math.random() * length)
    }

    function getRandomBall(): Ball {
      const pos = randomArrayItem(['top', 'right', 'bottom', 'left'])
      switch (pos) {
        case 'top':
          return {
            x: randomSidePos(can_w),
            y: -R,
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10),
          }
        case 'right':
          return {
            x: can_w + R,
            y: randomSidePos(can_h),
            vx: getRandomSpeed('right')[0],
            vy: getRandomSpeed('right')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10),
          }
        case 'bottom':
          return {
            x: randomSidePos(can_w),
            y: can_h + R,
            vx: getRandomSpeed('bottom')[0],
            vy: getRandomSpeed('bottom')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10),
          }
        case 'left':
          return {
            x: -R,
            y: randomSidePos(can_h),
            vx: getRandomSpeed('left')[0],
            vy: getRandomSpeed('left')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10),
          }
        default:
          return {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            r: R,
            alpha: 1,
            phase: 0,
          }
      }
    }

    function renderBalls() {
      balls.forEach((b) => {
        if (!b.hasOwnProperty('type')) {
          const gradient = ctx!.createLinearGradient(b.x - R, b.y, b.x + R, b.y)
          gradient.addColorStop(0, `rgba(108, 99, 255, ${b.alpha})`)
          gradient.addColorStop(1, `rgba(0, 240, 255, ${b.alpha})`)

          ctx!.fillStyle = gradient
          ctx!.beginPath()
          ctx!.arc(b.x, b.y, R, 0, Math.PI * 2, true)
          ctx!.closePath()
          ctx!.fill()
        }
      })
    }

    function updateBalls() {
      const new_balls: Ball[] = []
      balls.forEach((b) => {
        b.x += b.vx
        b.y += b.vy

        if (b.x > -50 && b.x < can_w + 50 && b.y > -50 && b.y < can_h + 50) {
          new_balls.push(b)
        }

        b.phase += alpha_f
        b.alpha = Math.abs(Math.cos(b.phase))
      })

      balls = new_balls.slice(0)
    }

    function renderLines() {
      let fraction, alpha
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          fraction = getDisOf(balls[i], balls[j]) / dis_limit

          if (fraction < 1) {
            alpha = (1 - fraction).toString()

            ctx!.strokeStyle = `rgba(150,150,150,${alpha})`
            ctx!.lineWidth = link_line_width

            ctx!.beginPath()
            ctx!.moveTo(balls[i].x, balls[i].y)
            ctx!.lineTo(balls[j].x, balls[j].y)
            ctx!.stroke()
            ctx!.closePath()
          }
        }
      }
    }

    function getDisOf(b1: Ball, b2: Ball): number {
      const delta_x = Math.abs(b1.x - b2.x)
      const delta_y = Math.abs(b1.y - b2.y)

      return Math.sqrt(delta_x * delta_x + delta_y * delta_y)
    }

    function addBallIfy() {
      if (balls.length < BALL_NUM) {
        balls.push(getRandomBall())
      }
    }

    function render() {
      ctx!.clearRect(0, 0, can_w, can_h)

      renderBalls()
      renderLines()
      updateBalls()
      addBallIfy()

      animationId = window.requestAnimationFrame(render)
    }

    function initBalls(num: number): void {
      for (let i = 1; i <= num; i++) {
        balls.push({
          x: randomSidePos(can_w),
          y: randomSidePos(can_h),
          vx: getRandomSpeed('top')[0],
          vy: getRandomSpeed('top')[1],
          r: R,
          alpha: 1,
          phase: randomNumFrom(0, 10),
        })
      }
    }

    function initCanvas(): void {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      can_w = canvas!.width
      can_h = canvas!.height
    }

    const handleResize = (): void => {
      initCanvas()
    }

    const handleMouseMove = (e: MouseEvent): void => {
      mouse_ball.x = e.clientX
      mouse_ball.y = e.clientY
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)

    let animationId: number
    initBalls(BALL_NUM)
    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className='w-full h-full'>
      <canvas
        ref={canvasRef}
        className='block rounded-l-xl'
        style={{ backgroundColor: 'oklch(.145 0 0)' }}
      />
    </div>
  )
}
