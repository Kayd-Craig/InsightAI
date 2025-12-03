'use client'
import SocialMediaDropdown from '@/app/components/SocialMediaDropdown'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ChatToggle } from '@/components/dashboard-client'
import { useState } from 'react'

export function SiteHeader({
  page,
  showChat = false,
}: {
  page: string
  showChat?: boolean
}) {
  const [activeTab, setActiveTab] = useState<string>('instagram')
  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />
        <h1 className='text-base font-medium'>{page}</h1>
        <div className='ml-auto flex items-center gap-2'>
          {page === 'Dashboard' ? (
            <SocialMediaDropdown
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ) : (
            <></>
          )}
          {showChat && page === 'Dashboard' && (
            <Separator
              orientation='vertical'
              className='mx-1 data-[orientation=vertical]:h-4'
            />
          )}
          {showChat && <ChatToggle />}
        </div>
      </div>
    </header>
  )
}
