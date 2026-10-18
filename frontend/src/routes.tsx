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
import { CalculatorPage } from './pages/dashboard/CalculatorPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { ItemPurchasesListPage } from './pages/item-purchases/ItemPurchasesListPage'
import { ItemPurchaseViewPage } from './pages/item-purchases/ItemPurchaseViewPage'
import { ItemViewPage } from './pages/items/ItemViewPage'
import { ListingViewPage } from './pages/listings/ListingViewPage'
import { ListingsListPage } from './pages/listings/ListingsListPage'
import { OrderViewPage } from './pages/orders/OrderViewPage'
import { OrdersListPage } from './pages/orders/OrdersListPage'
import { ReturnViewPage } from './pages/returns/ReturnViewPage'
import { ReturnsListPage } from './pages/returns/ReturnsListPage'
import { PostagePoliciesListPage } from './pages/postage-policies/PostagePoliciesListPage'
import { PostagePolicyViewPage } from './pages/postage-policies/PostagePolicyViewPage'
import { AccountPage } from './pages/settings/AccountPage'
import { UsersListPage } from './pages/settings/UsersListPage'
import { UserViewPage } from './pages/settings/UserViewPage'
import { StorageListPage } from './pages/storage/StorageListPage'
import { StorageViewPage } from './pages/storage/StorageViewPage'
import { SupplyViewPage } from './pages/supplies/SupplyViewPage'
import { SupplyPurchasesListPage } from './pages/supply-purchases/SupplyPurchasesListPage'
import { SupplyPurchaseViewPage } from './pages/supply-purchases/SupplyPurchaseViewPage'

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
                    {
                        path: 'storage/list/:type/:id',
                        element: <StorageListPage />
                    },
                    {
                        path: 'storage/view/:Id',
                        element: <StorageViewPage />
                    },
                    {
                        path: 'listings/view/:Id',
                        element: <ListingViewPage />
                    },
                    {
                        path: 'listings/:status',
                        element: <ListingsListPage />
                    },
                    {
                        path: 'orders/view/:Id',
                        element: <OrderViewPage />
                    },
                    {
                        path: 'orders/:status',
                        element: <OrdersListPage />
                    },
                    {
                        path: 'returns/view/:Id',
                        element: <ReturnViewPage />
                    },
                    {
                        path: 'returns/:status',
                        element: <ReturnsListPage />
                    },
                    {
                        path: 'postage-policies',
                        element: <PostagePoliciesListPage />
                    },
                    {
                        path: 'postage-policies/:id',
                        element: <PostagePolicyViewPage />
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
                    {
                        path: 'settings/users',
                        element: <UsersListPage />
                    },
                    {
                        path: 'settings/users/:id',
                        element: <UserViewPage />
                    }
                ]
            },
            { path: 'auth/logout', element: <Navigate to="/" replace /> },
            { path: '*', element: <NotFoundPage /> }
        ]
    }
])
