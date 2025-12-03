'use client'

import * as React from 'react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Logo } from '@/app/components/Logo'

// const data = {
//   user: {
//     name: 'shadcn',
//     email: 'm@example.com',
//     avatar: '/avatars/shadcn.jpg',
//   },
//   navMain: [
//     {
//       title: 'Dashboard',
//       url: '/dashboard',
//       icon: faRobot,
//     },
//     {
//       title: 'Chat',
//       url: '/chat',
//       icon: faRobot,
//     },
//     {
//       title: 'Goals',
//       url: '/goals',
//       icon: faRobot,
//     },
//   ],
// }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='flex flex-row items-center p-0'>
        <Logo
          className={`flex-shrink-0 ${isCollapsed ? '!size-12' : '!size-12'}`}
        />
        {isCollapsed ? <></> : <span className='text-xl -ml-2'>insightAI</span>}
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
