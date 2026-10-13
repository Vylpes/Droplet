import { Navigate, createBrowserRouter } from 'react-router'
import { GuestRoute } from './auth/GuestRoute'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Layout } from './layout/Layout'
import { AdminRegisterPage } from './pages/auth/AdminRegisterPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RequestPasswordResetPage } from './pages/auth/RequestPasswordResetPage'
import { RequestVerificationTokenPage } from './pages/auth/RequestVerificationTokenPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { VerifyPage } from './pages/auth/VerifyPage'
import { ErrorPage } from './pages/ErrorPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { AccountPage } from './pages/settings/AccountPage'

function placeholder(title: string) {
    return <PlaceholderPage title={title} />
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            {
                element: <GuestRoute />,
                children: [
                    { path: 'auth/login', element: <LoginPage /> },
                    {
                        path: 'auth/admin-register',
                        element: <AdminRegisterPage />
                    },
                    { path: 'auth/verify', element: <VerifyPage /> },
                    {
                        path: 'auth/password-reset/request',
                        element: <RequestPasswordResetPage />
                    },
                    {
                        path: 'auth/password-reset/reset',
                        element: <ResetPasswordPage />
                    },
                    {
                        path: 'auth/verification-token/request',
                        element: <RequestVerificationTokenPage />
                    }
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'dashboard', element: placeholder('Dashboard') },
                    {
                        path: 'dashboard/calculator',
                        element: placeholder('Calculator')
                    },
                    {
                        path: 'item-purchases/new',
                        element: placeholder('New Item Purchase')
                    },
                    {
                        path: 'item-purchases/view/:Id',
                        element: placeholder('Item Purchase')
                    },
                    {
                        path: 'item-purchases/:status',
                        element: placeholder('Item Purchases')
                    },
                    { path: 'items/new', element: placeholder('New Item') },
                    { path: 'items/:itemId', element: placeholder('Item') },
                    {
                        path: 'supply-purchases/new',
                        element: placeholder('New Supply Purchase')
                    },
                    {
                        path: 'supply-purchases/view/:Id',
                        element: placeholder('Supply Purchase')
                    },
                    {
                        path: 'supply-purchases/:status',
                        element: placeholder('Supply Purchases')
                    },
                    { path: 'supplies/new', element: placeholder('New Supply') },
                    { path: 'supplies/:Id', element: placeholder('Supply') },
                    { path: 'storage/new', element: placeholder('New Storage') },
                    {
                        path: 'storage/list/:type/:id',
                        element: placeholder('Storage List')
                    },
                    {
                        path: 'storage/view/:Id',
                        element: placeholder('Storage')
                    },
                    { path: 'listings/new', element: placeholder('New Listing') },
                    {
                        path: 'listings/view/:Id',
                        element: placeholder('Listing')
                    },
                    {
                        path: 'listings/:status',
                        element: placeholder('Listings')
                    },
                    { path: 'orders/new', element: placeholder('New Order') },
                    { path: 'orders/view/:Id', element: placeholder('Order') },
                    { path: 'orders/:status', element: placeholder('Orders') },
                    { path: 'returns/new', element: placeholder('New Return') },
                    { path: 'returns/view/:Id', element: placeholder('Return') },
                    { path: 'returns/:status', element: placeholder('Returns') },
                    {
                        path: 'postage-policies',
                        element: placeholder('Postage Policies')
                    },
                    {
                        path: 'postage-policies/new',
                        element: placeholder('New Postage Policy')
                    },
                    {
                        path: 'postage-policies/:id',
                        element: placeholder('Postage Policy')
                    },
                    {
                        path: 'settings/account',
                        element: <AccountPage />
                    }
                ]
            },
            {
                element: <ProtectedRoute admin />,
                children: [
                    { path: 'settings/users', element: placeholder('Users') },
                    {
                        path: 'settings/users/create',
                        element: placeholder('Create User')
                    },
                    {
                        path: 'settings/users/:id',
                        element: placeholder('User')
                    }
                ]
            },
            { path: 'auth/logout', element: <Navigate to="/" replace /> },
            { path: '*', element: <NotFoundPage /> }
        ]
    }
])
