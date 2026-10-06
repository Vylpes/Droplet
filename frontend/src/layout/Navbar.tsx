import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavbarBS from 'react-bootstrap/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator, faCog } from '@fortawesome/free-solid-svg-icons'
import { Link, NavLink, useNavigate } from 'react-router'
import { useAlerts } from '../alerts/useAlerts'
import { useAuth } from '../auth/useAuth'

export function Navbar() {
    const { isAuthenticated, user, logout } = useAuth()
    const { showError } = useAlerts()
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(false)

    const closeMenu = () => setExpanded(false)

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
        <NavbarBS
            expand="lg"
            bg="light"
            expanded={expanded}
            onToggle={setExpanded}
        >
            <Container fluid>
                <NavbarBS.Brand
                    as={Link}
                    to={isAuthenticated ? '/dashboard' : '/'}
                    onClick={closeMenu}
                >
                    Droplet
                </NavbarBS.Brand>
                <NavbarBS.Toggle aria-controls="main-navbar" />
                <NavbarBS.Collapse id="main-navbar">
                    {isAuthenticated ? (
                        <>
                            <Nav className="me-auto mb-2 mb-lg-0">
                                <Nav.Link as={NavLink} to="/dashboard" onClick={closeMenu}>
                                    Dashboard
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/item-purchases/ordered"
                                    onClick={closeMenu}
                                >
                                    Items
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/supply-purchases/ordered"
                                    onClick={closeMenu}
                                >
                                    Supplies
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/storage/list/building/all"
                                    onClick={closeMenu}
                                >
                                    Storage
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/listings/active"
                                    onClick={closeMenu}
                                >
                                    Listings
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/orders/awaiting-payment"
                                    onClick={closeMenu}
                                >
                                    Orders
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/returns/opened"
                                    onClick={closeMenu}
                                >
                                    Returns
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/postage-policies"
                                    end
                                    onClick={closeMenu}
                                >
                                    Postage Policies
                                </Nav.Link>
                            </Nav>

                            <Nav className="ms-auto mb-2 mb-lg-0">
                                <Nav.Link as="button" type="button" onClick={handleLogout}>
                                    Logout
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/dashboard/calculator"
                                    onClick={closeMenu}
                                    title="Calculator"
                                >
                                    <FontAwesomeIcon icon={faCalculator} />
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/settings/account"
                                    onClick={closeMenu}
                                    title="Settings"
                                >
                                    <FontAwesomeIcon icon={faCog} />
                                </Nav.Link>
                                <NavbarBS.Text className="ms-1">
                                    Logged in as {user?.Username}
                                </NavbarBS.Text>
                            </Nav>
                        </>
                    ) : (
                        <>
                            <Nav className="me-auto mb-2 mb-lg-0">
                                <Nav.Link as={NavLink} to="/" end onClick={closeMenu}>
                                    Home
                                </Nav.Link>
                            </Nav>

                            <Nav className="ms-auto mb-2 mb-lg-0">
                                <Nav.Link
                                    as={NavLink}
                                    to="/auth/login"
                                    onClick={closeMenu}
                                >
                                    Login
                                </Nav.Link>
                            </Nav>
                        </>
                    )}
                </NavbarBS.Collapse>
            </Container>
        </NavbarBS>
    )
}
