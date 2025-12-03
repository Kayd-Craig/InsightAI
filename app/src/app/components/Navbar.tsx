'use client'
import {
  faChartSimple,
  faGear,
  faMessage,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Logo } from './Logo'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleButtonClick = (buttonName: string, path: string) => {
    router.push(path)
  }

  const isActive = (path: string) => pathname === path

  const menuItems = [
    {
      name: 'dashboard',
      icon: faChartSimple,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      name: 'chat',
      icon: faMessage,
      label: 'Chat',
      path: '/chat',
    },
    {
      name: 'settings',
      icon: faGear,
      label: 'Settings',
      path: '/settings',
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className='flex flex-col gap-7'>
            <div className='flex flex-row justify-left items-center'>
              <Logo />
              <span className='text-white text-xl'>insightAI</span>
            </div>
            <SidebarMenu className='w-full'>
              {menuItems.map((item) => (
                <SidebarMenuItem
                  key={item.name}
                  className={`
                      text-white underline-animation-center w-full
                      ${isActive(item.path) ? 'gradient-border-bottom' : ''}
                    `}
                >
                  <SidebarMenuButton
                    onClick={() => handleButtonClick(item.name, item.path)}
                    isActive={isActive(item.path)}
                    className='w-full'
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className='mr-3 ml-1 max-w-[1rem] max-h-[1rem]'
                    />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
