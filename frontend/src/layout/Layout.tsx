import Container from 'react-bootstrap/Container'
import { Outlet } from 'react-router'
import { Alerts } from '../alerts/Alerts'
import { Navbar } from './Navbar'

export function Layout() {
    return (
        <>
            <Navbar />
            <Container className="mt-3 mb-4">
                <Alerts />
                <Outlet />
            </Container>
        </>
    )
}
