import { Outlet } from 'react-router'
import Sidebar from '@/components/shared/Sidebar'
import Navbar from '@/components/shared/Navbar'
import { useAuth } from '@/hooks/UseAuth'
import MobileNav from '@/components/shared/MobileNav'

const DashboardLayout = () => {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar user={user} />

        <main className="flex-1 px-4 pb-28 pt-7 sm:px-6 sm:pt-8 lg:px-8 lg:pb-10 lg:pt-10">
          <div className="mx-auto w-full max-w-7xl animate-float-in">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}

export default DashboardLayout
