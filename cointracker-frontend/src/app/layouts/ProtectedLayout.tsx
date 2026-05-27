import {
    Navigate,
    Outlet,
    useLocation,
} from 'react-router'

import { isAuthenticated } from '../../lib/auth-storage'

const ProtectedLayout = () => {

    const location = useLocation()

    if (!isAuthenticated()) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        )
    }

    return <Outlet />
}

export default ProtectedLayout