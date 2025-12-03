import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { FacebookSDK } from '@/components/sdk/FacebookSDK'
import { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'insightAI',
  description: '-',
  icons: {
    icon: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className='dark'
      style={{ backgroundColor: 'oklch(.205 0 0)' }}
    >
      <body className={roboto.className}>
        <FacebookSDK />
        <SpeedInsights />
        <Analytics />
        {children}
      </body>
    </html>
  )
}
