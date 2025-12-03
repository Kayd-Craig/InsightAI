import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { OpenAIChatComponent } from '../components/OpenAiChat'

export default function chat() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
      className='h-screen overflow-hidden'
    >
      <AppSidebar variant='inset' />
      <SidebarInset className='flex flex-col h-full overflow-hidden'>
        <SiteHeader page='AI Assistant' />
        <div className='flex-1 min-h-0 overflow-hidden'>
          <OpenAIChatComponent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
