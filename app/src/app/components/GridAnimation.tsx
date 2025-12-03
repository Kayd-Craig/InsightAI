import React from 'react'

export const GridAnimation = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => {
  return (
    <div className='relative h-[500px] flex flex-col justify-center items-center bg-[#0a0a14] text-white overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(108,99,255,0.3),_transparent_60%),_radial-gradient(circle_at_bottom_right,_rgba(0,240,255,0.3),_transparent_60%)] animate-pulse' />

      <div className='absolute inset-0 opacity-40'>
        <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
          <defs>
            <pattern
              id='grid'
              width='40'
              height='40'
              patternUnits='userSpaceOnUse'
            >
              <path
                d='M 40 0 L 0 0 0 40'
                fill='none'
                stroke='rgba(255,255,255,0.06)'
                strokeWidth='1'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid)' />
        </svg>
      </div>

      <div className='absolute inset-0 bg-gradient-to-br from-[#6c63ff]/30 via-transparent to-[#00f0ff]/30 mix-blend-screen animate-[pulse_6s_ease-in-out_infinite]' />

      <div className='absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-r from-transparent via-[#00f0ff]/10 to-transparent animate-[move-glow_8s_linear_infinite]' />

      <h2 className='relative z-10 text-4xl font-bold mb-2'>{title}</h2>
      <p className='relative z-10 text-lg text-white/80'>{subtitle}</p>

      <style jsx>{`
        @keyframes move-glow {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(50%);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
