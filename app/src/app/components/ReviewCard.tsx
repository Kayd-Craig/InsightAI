import { StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'
import Image from 'next/image'
const ReviewCard = ({
  avatar,
  name,
  username,
  title,
  company,
  body,
}: {
  avatar: string | StaticImageData
  name: string
  username: string
  title: string
  company: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        'relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-6',
        'border-gray-950/[.1] bg-white hover:bg-gray-950/[.05]',
        'shadow-md'
      )}
    >
      <div className='flex flex-row items-center gap-3'>
        {typeof avatar === 'string' ? (
          <img
            className='rounded-full w-12 h-12 object-cover'
            alt={name}
            src={avatar}
          />
        ) : (
          <Image
            src={avatar}
            alt={name}
            width={48}
            height={48}
            className='rounded-full object-cover'
          />
        )}
        <div className='flex flex-col'>
          <figcaption className='text-sm font-semibold text-gray-900'>
            {name}
          </figcaption>
          <p className='text-xs font-medium text-gray-600'>{username}</p>
          <p className='text-xs text-gray-500'>
            {title} at {company}
          </p>
        </div>
      </div>
      <blockquote className='mt-4 text-sm text-gray-800 leading-relaxed'>
        {body}
      </blockquote>
    </figure>
  )
}

export default ReviewCard
