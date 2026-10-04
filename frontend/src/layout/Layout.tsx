import { Outlet } from 'react-router'
import { Alerts } from '../alerts/Alerts'
import { Navbar } from './Navbar'

export function Layout() {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="app-container">
                <Alerts />
                <Outlet />
            </main>
        </div>
    )
}
