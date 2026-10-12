import type { ReactNode } from 'react'

/** Centered column layout matching legacy auth Pug pages. */
export function AuthFormLayout({ children }: { children: ReactNode }) {
    return (
        <div className="row">
            <div className="col-md-6 mx-auto">{children}</div>
        </div>
    )
}
