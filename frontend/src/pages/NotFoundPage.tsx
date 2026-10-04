import { Link } from 'react-router'

export function NotFoundPage() {
    return (
        <section className="error-page">
            <h1>404</h1>
            <h2>Not Found</h2>
            <p>
                <Link to="/">Return home</Link>
            </p>
        </section>
    )
}
