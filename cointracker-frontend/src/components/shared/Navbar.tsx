import { Bell } from 'lucide-react'

type NavbarProps = {
    userEmail?: string
}

const Navbar = ({ userEmail }: NavbarProps) => {
    return (
        <header className="sticky top-0 z-20 border-b border-white/50 bg-white/60 backdrop-blur-2xl">

            <div className="flex h-20 items-center justify-between px-6">

                <div>
                    <h1 className="text-xl font-semibold text-neutral-900">
                        Dashboard
                    </h1>

                    <p className="text-sm text-neutral-500">
                        {userEmail ? `Welcome back, ${userEmail}` : 'Welcome back'}
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm hover:bg-neutral-50 transition">
                        <Bell size={18} />
                    </button>

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 text-white text-sm font-semibold">
                        U
                    </div>

                </div>

            </div>

        </header>
    )
}

export default Navbar