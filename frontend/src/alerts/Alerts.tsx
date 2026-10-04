import { useAlerts } from './useAlerts'

export function Alerts() {
    const { alerts, dismiss } = useAlerts()

    if (alerts.length === 0) {
        return null
    }

    return (
        <div className="alerts" role="region" aria-label="Notifications">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className={`alert alert-${alert.type}`}
                    role={alert.type === 'error' ? 'alert' : 'status'}
                >
                    <span>{alert.message}</span>
                    <button
                        type="button"
                        className="alert-dismiss"
                        aria-label="Dismiss"
                        onClick={() => dismiss(alert.id)}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    )
}
