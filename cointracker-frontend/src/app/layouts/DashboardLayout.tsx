import { Outlet } from 'react-router'
import Sidebar from '@/components/shared/Sidebar'
import Navbar from '@/components/shared/Navbar'
import { useAuth } from '@/hooks/UseAuth'
import MobileNav from '@/components/shared/MobileNav'
import InstallPrompt from '@/components/shared/InstallPrompt'

const DashboardLayout = () => {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-clip bg-transparent">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar user={user} />

        <main className="min-w-0 flex-1 overflow-x-clip px-3 pb-28 pt-7 sm:px-6 sm:pt-8 lg:px-8 lg:pb-10 lg:pt-10">
          <div className="mx-auto w-full max-w-7xl min-w-0 animate-float-in">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
      <InstallPrompt />
    </div>
  )
}

export default DashboardLayout
