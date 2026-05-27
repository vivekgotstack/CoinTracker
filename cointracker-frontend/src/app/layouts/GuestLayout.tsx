import { isAuthenticated } from '@/lib/auth-storage'
import {
    Navigate,
    Outlet,
} from 'react-router'


const GuestLayout = () => {

    if (isAuthenticated()) {

        return (
            <Navigate
                to="/"
                replace
            />
        )
    }

    return <Outlet />
}

export default GuestLayout