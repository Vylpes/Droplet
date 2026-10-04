interface PlaceholderPageProps {
    title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
    return (
        <section className="placeholder-page">
            <h1>{title}</h1>
            <p>This page will be implemented in a later story.</p>
        </section>
    )
}
