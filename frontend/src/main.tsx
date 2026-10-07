import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AlertProvider } from './alerts/AlertContext'
import { AuthProvider } from './auth/AuthContext'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AlertProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </AlertProvider>
    </StrictMode>
)
