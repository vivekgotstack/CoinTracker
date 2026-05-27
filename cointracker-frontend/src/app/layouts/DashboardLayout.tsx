import { Outlet } from 'react-router'

import Sidebar from '../../components/shared/Sidebar'
import Navbar from '../../components/shared/Navbar'

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#f5f7fb]">

            {/* Fixed sidebar column */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex min-w-0 flex-1 flex-col">

                <Navbar />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>

            </div>

        </div>
    )
}

export default DashboardLayout