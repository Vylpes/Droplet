import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { useAlerts } from '../alerts/useAlerts'
import { useAuth } from '../auth/useAuth'

export function Navbar() {
    const { isAuthenticated, user, logout } = useAuth()
    const { showError } = useAlerts()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const closeMenu = () => setOpen(false)

    const handleLogout = async () => {
        closeMenu()
        try {
            await logout()
            navigate('/')
        } catch {
            showError('Failed to log out. Please try again.')
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link
                    to={isAuthenticated ? '/dashboard' : '/'}
                    className="navbar-brand"
                    onClick={closeMenu}
                >
                    Droplet
                </Link>

                <button
                    type="button"
                    className="navbar-toggler"
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                    onClick={() => setOpen((value) => !value)}
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className={`navbar-collapse${open ? ' is-open' : ''}`}>
                    {isAuthenticated ? (
                        <>
                            <ul className="navbar-nav">
                                <li>
                                    <NavLink to="/dashboard" onClick={closeMenu}>
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/item-purchases/ordered" onClick={closeMenu}>
                                        Items
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/supply-purchases/ordered" onClick={closeMenu}>
                                        Supplies
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/storage/list/building/all" onClick={closeMenu}>
                                        Storage
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/listings/active" onClick={closeMenu}>
                                        Listings
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/orders/awaiting-payment" onClick={closeMenu}>
                                        Orders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/returns/opened" onClick={closeMenu}>
                                        Returns
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/postage-policies" end onClick={closeMenu}>
                                        Postage Policies
                                    </NavLink>
                                </li>
                            </ul>

                            <ul className="navbar-nav navbar-nav-end">
                                <li>
                                    <button
                                        type="button"
                                        className="nav-button"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                                <li>
                                    <NavLink
                                        to="/dashboard/calculator"
                                        onClick={closeMenu}
                                        title="Calculator"
                                    >
                                        Calculator
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/settings/account"
                                        onClick={closeMenu}
                                        title="Settings"
                                    >
                                        Settings
                                    </NavLink>
                                </li>
                                <li className="navbar-text">
                                    Logged in as {user?.Username}
                                </li>
                            </ul>
                        </>
                    ) : (
                        <>
                            <ul className="navbar-nav">
                                <li>
                                    <NavLink to="/" end onClick={closeMenu}>
                                        Home
                                    </NavLink>
                                </li>
                            </ul>

                            <ul className="navbar-nav navbar-nav-end">
                                <li>
                                    <NavLink to="/auth/login" onClick={closeMenu}>
                                        Login
                                    </NavLink>
                                </li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
