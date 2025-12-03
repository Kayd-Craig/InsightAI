import Image from 'next/image'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export const Logo = ({ className, width = 50, height = 50 }: LogoProps) => {
  return (
    <Image
      src='/images/logo.png'
      alt='InsightAI Logo'
      width={width}
      height={height}
      className={className}
      priority
      style={{
        backgroundColor: 'transparent',
      }}
    />
  )
}
