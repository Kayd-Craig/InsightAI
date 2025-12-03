import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInstagram,
  faTiktok,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons'
import {
  faChartLine,
  faUserFriends,
  faHeart,
  faComments,
} from '@fortawesome/free-solid-svg-icons'
import AIAnimatedBackground from './AIBackground'
import { Logo } from './Logo'

interface AccountSignInPromptProps {
  onSignIn: (platform: string) => void
}

const previews = [
  {
    key: 'instagram',
    icon: faInstagram,
    title: 'instagram',
    metrics: [
      { icon: faChartLine, label: 'follower growth' },
      { icon: faHeart, label: 'likes & engagement' },
      { icon: faComments, label: 'comments' },
      { icon: faUserFriends, label: 'audience demographics' },
    ],
    description:
      'unlock detailed analytics on your posts, stories, audience, and engagement.',
  },
  {
    key: 'tiktok',
    icon: faTiktok,
    title: 'tiktok',
    metrics: [
      { icon: faChartLine, label: 'video views' },
      { icon: faHeart, label: 'likes & shares' },
      { icon: faComments, label: 'comments' },
      { icon: faUserFriends, label: 'follower insights' },
    ],
    description:
      'see which videos perform best, track engagement, and understand your tiktok audience.',
  },
  {
    key: 'x',
    icon: faXTwitter,
    title: 'x',
    metrics: [
      { icon: faChartLine, label: 'tweet impressions' },
      { icon: faHeart, label: 'likes & retweets' },
      { icon: faComments, label: 'replies' },
      { icon: faUserFriends, label: 'follower growth' },
    ],
    description:
      'analyze tweet reach, engagement, and audience growth with x api insights.',
  },
]

const AccountSignIn: React.FC<AccountSignInPromptProps> = ({ onSignIn }) => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <AIAnimatedBackground />
      <div className='flex flex-col p-10 max-w-6xl w-full min-h-[600px] text-center justify-center relative z-10'>
        <div className='mb-8'>
          <div className='flex flex-row items-center justify-center mb-3'>
            <Logo />
            <span className='text-2xl text-white'>insightAI</span>
          </div>
          <p className='text-md text-white'>
            get started by linking one of your accounts. you can add different
            accounts later to manage them all in one place
          </p>
        </div>
        <div className='flex flex-row gap-8 justify-center items-stretch w-full'>
          {previews.map((platform) => (
            <div
              key={platform.key}
              className='flex flex-col items-center bg-gray-50 rounded-lg p-6 shadow w-1/2'
            >
              <FontAwesomeIcon
                icon={platform.icon}
                className='text-3xl mb-2 text-black'
              />
              <h3 className='font-semibold text-lg mb-1'>{platform.title}</h3>
              <p className='text-xs text-gray-500 mb-3'>
                {platform.description}
              </p>
              <ul className='mb-4 space-y-2 text-left w-full'>
                {platform.metrics.map((metric) => (
                  <li
                    key={metric.label}
                    className='flex items-center text-sm text-gray-700'
                  >
                    <FontAwesomeIcon
                      icon={metric.icon}
                      className='mr-2 text-black'
                    />
                    {metric.label}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSignIn(platform.key)}
                className='w-full cursor-pointer flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition'
              >
                <FontAwesomeIcon
                  icon={platform.icon}
                  className='mr-2 text-black'
                />
                continue with {platform.title}
              </button>
            </div>
          ))}
        </div>
        <p className='text-gray-400 text-xs mt-8'>
          by continuing, you agree to insightAI&apos;s{' '}
          <a href='#' className='text-blue-500 hover:underline'>
            terms of service
          </a>{' '}
          and{' '}
          <a href='#' className='text-blue-500 hover:underline'>
            privacy policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default AccountSignIn
