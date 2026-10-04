export function HomePage() {
    return (
        <section className="home-page">
            <div className="home-card">
                <header className="home-card-header">In Development</header>
                <div className="home-card-body">
                    <h1>This site is currently in development.</h1>
                    <ul>
                        <li>Features will be incomplete</li>
                        <li>Features will be buggy</li>
                    </ul>
                    <div className="home-actions">
                        <a
                            href="https://github.com/vylpes/sonar"
                            className="btn btn-primary"
                        >
                            View GitHub
                        </a>
                        <a
                            href="https://github.com/Vylpes/Sonar/issues/new"
                            className="btn btn-outline"
                        >
                            Report a Bug
                        </a>
                        <a
                            href="https://discord.gg/UyAhAVp"
                            className="btn btn-outline"
                        >
                            Join Discord
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
