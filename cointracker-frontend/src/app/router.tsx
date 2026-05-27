import { createBrowserRouter } from 'react-router'
import { lazy, Suspense } from 'react'

import GuestLayout from './layouts/GuestLayout'
import ProtectedLayout from './layouts/ProtectedLayout'

import PageLoader from '@/components/ui/PageLoader'
import ErrorPage from '@/components/ui/ErrorPage'

/* layouts */
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))

/* pages */
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'))
const AnalyticsPage = lazy(() => import('../pages/analytics/AnalyticsPage'))
const CategoryPage = lazy(() => import('../pages/categories/CategoryPage'))
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'))
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'))
const IncomePage = lazy(() => import('../pages/transactions/IncomePage'))
const ExpensePage = lazy(() => import('../pages/transactions/ExpensePage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const SignupPage = lazy(() => import('../pages/auth/SignupPage'))

/* single suspense wrapper ONLY */
const withSuspense = (node: React.ReactNode) => (
    <Suspense fallback={<PageLoader />}>{node}</Suspense>
)

export const router = createBrowserRouter([
    {
        Component: GuestLayout,
        errorElement: <ErrorPage />,

        children: [
            {
                path: '/login',
                Component: () => withSuspense(<LoginPage />),
            },
            {
                path: '/signup',
                Component: () => withSuspense(<SignupPage />),
            },
        ],
    },

    {
        Component: ProtectedLayout,
        errorElement: <ErrorPage />,

        children: [
            {
                Component: () => withSuspense(<DashboardLayout />),

                children: [
                    {
                        index: true,
                        Component: () => withSuspense(<DashboardPage />),
                    },
                    {
                        path: 'expenses',
                        Component: () => withSuspense(<ExpensePage />),
                    },
                    {
                        path: 'income',
                        Component: () => withSuspense(<IncomePage />),
                    },
                    {
                        path: 'analytics',
                        Component: () => withSuspense(<AnalyticsPage />),
                    },
                    {
                        path: 'categories',
                        Component: () => withSuspense(<CategoryPage />),
                    },
                    {
                        path: 'profile',
                        Component: () => withSuspense(<ProfilePage />),
                    },
                    {
                        path: 'settings',
                        Component: () => withSuspense(<SettingsPage />),
                    },
                ],
            },
        ],
    },
])