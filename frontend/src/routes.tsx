import { Navigate, createBrowserRouter } from 'react-router'
import { GuestRoute } from './auth/GuestRoute'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Layout } from './layout/Layout'
import { ErrorPage } from './pages/ErrorPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

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
                    { path: 'auth/login', element: placeholder('Login') },
                    {
                        path: 'auth/admin-register',
                        element: placeholder('Admin Register')
                    },
                    { path: 'auth/verify', element: placeholder('Verify Account') },
                    {
                        path: 'auth/password-reset/request',
                        element: placeholder('Request Password Reset')
                    },
                    {
                        path: 'auth/password-reset/reset',
                        element: placeholder('Reset Password')
                    },
                    {
                        path: 'auth/verification-token/request',
                        element: placeholder('Request Verification Token')
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
                        element: placeholder('Account Settings')
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
