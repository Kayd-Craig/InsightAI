'use client'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useRouter, usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faChartSimple } from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface itemType {
  title: string
  url: string
  icon?: IconDefinition
}

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: faChartSimple,
    },
    {
      title: 'AI Assistant',
      url: '/chat',
      icon: faRobot,
    },
  ],
}

export function NavMain() {
  const router = useRouter()
  const pathname = usePathname()

  function handleClick(item: itemType) {
    router.push(item.url)
  }

  const isActive = (url: string) => pathname === url

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem
              key={item.title}
              onClick={() => handleClick(item)}
              className={
                isActive(item.url)
                  ? `underline-animation-center gradient-border-bottom my-1`
                  : `underline-animation-center my-1`
              }
            >
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <FontAwesomeIcon icon={item.icon} size='2x' />}
                <span className='text-md'>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
