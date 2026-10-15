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
import { CalculatorPage } from './pages/dashboard/CalculatorPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { ItemPurchasesListPage } from './pages/item-purchases/ItemPurchasesListPage'
import { ItemPurchaseViewPage } from './pages/item-purchases/ItemPurchaseViewPage'
import { ItemViewPage } from './pages/items/ItemViewPage'
import { AccountPage } from './pages/settings/AccountPage'
import { SupplyViewPage } from './pages/supplies/SupplyViewPage'
import { SupplyPurchasesListPage } from './pages/supply-purchases/SupplyPurchasesListPage'
import { SupplyPurchaseViewPage } from './pages/supply-purchases/SupplyPurchaseViewPage'

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
                    { path: 'dashboard', element: <DashboardPage /> },
                    {
                        path: 'dashboard/calculator',
                        element: <CalculatorPage />
                    },
                    {
                        path: 'item-purchases/view/:Id',
                        element: <ItemPurchaseViewPage />
                    },
                    {
                        path: 'item-purchases/:status',
                        element: <ItemPurchasesListPage />
                    },
                    { path: 'items/:itemId', element: <ItemViewPage /> },
                    {
                        path: 'supply-purchases/view/:Id',
                        element: <SupplyPurchaseViewPage />
                    },
                    {
                        path: 'supply-purchases/:status',
                        element: <SupplyPurchasesListPage />
                    },
                    { path: 'supplies/:Id', element: <SupplyViewPage /> },
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
