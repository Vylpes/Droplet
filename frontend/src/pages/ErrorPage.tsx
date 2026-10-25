import Container from 'react-bootstrap/Container'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Alerts } from '../alerts/Alerts'
import { Navbar } from '../layout/Navbar'

export function ErrorPage() {
    const error = useRouteError()
    const isDev = import.meta.env.DEV

    let status = 500
    let message = 'Something went wrong.'
    let stack: string | undefined

    if (isRouteErrorResponse(error)) {
        status = error.status
        message = error.statusText || message
    } else if (error instanceof Error) {
        message = error.message
        stack = error.stack
    }

    return (
        <>
            <Navbar />
            <Container className="mt-3 mb-4">
                <Alerts />
                <section>
                    <h1>Error {status}</h1>
                    {isDev ? (
                        <>
                            <h2>{message}</h2>
                            {stack ? <pre className="error-stack">{stack}</pre> : null}
                        </>
                    ) : (
                        <p>{message}</p>
                    )}
                    <p>
                        <Link to="/">Return home</Link>
                    </p>
                </section>
            </Container>
        </>
    )
}
