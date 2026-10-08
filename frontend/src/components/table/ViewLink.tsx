import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router'

interface ViewLinkProps {
    to: string
    label?: string
}

/** Action link matching Pug list/view “View” buttons (eye icon). */
export function ViewLink({ to, label = 'View' }: ViewLinkProps) {
    return (
        <Link to={to} className="btn text-primary">
            <FontAwesomeIcon icon={faEye} />
            <span className="ms-1">{label}</span>
        </Link>
    )
}
