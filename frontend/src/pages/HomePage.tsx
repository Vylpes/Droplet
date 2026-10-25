import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

export function HomePage() {
    return (
        <Card className="mx-auto" style={{ maxWidth: '40rem' }}>
            <Card.Header>In Development</Card.Header>
            <Card.Body>
                <Card.Title as="h1" className="h3">
                    This site is currently in development.
                </Card.Title>
                <ul>
                    <li>Features will be incomplete</li>
                    <li>Features will be buggy</li>
                </ul>
                <div className="home-actions">
                    <Button
                        variant="primary"
                        href="https://github.com/vylpes/sonar"
                    >
                        View GitHub
                    </Button>
                    <Button
                        variant="outline-primary"
                        href="https://github.com/Vylpes/Sonar/issues/new"
                    >
                        Report a Bug
                    </Button>
                    <Button
                        variant="outline-primary"
                        href="https://discord.gg/UyAhAVp"
                    >
                        Join Discord
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}
