import type { ReactNode } from 'react'

export function DetailField({
    label,
    children,
}: {
    label: string
    children: ReactNode
}) {
    return (
        <div className="mb-2">
            <p className="mb-0 text-secondary">{label}</p>
            <p className="mb-0">{children}</p>
        </div>
    )
}
