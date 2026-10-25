import Alert from 'react-bootstrap/Alert'
import { useAlerts } from './useAlerts'

export function Alerts() {
    const { alerts, dismiss } = useAlerts()

    if (alerts.length === 0) {
        return null
    }

    return (
        <div className="mb-3" role="region" aria-label="Notifications">
            {alerts.map((alert) => (
                <Alert
                    key={alert.id}
                    variant={alert.type === 'error' ? 'danger' : 'info'}
                    dismissible
                    onClose={() => dismiss(alert.id)}
                    role={alert.type === 'error' ? 'alert' : 'status'}
                >
                    {alert.message}
                </Alert>
            ))}
        </div>
    )
}
