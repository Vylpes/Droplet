import type { FormEventHandler, ReactNode } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons'

export interface FormPageProps {
    title?: string
    onSubmit: FormEventHandler<HTMLFormElement>
    children: ReactNode
    formError?: string
    submitLabel?: string
    isSubmitting?: boolean
    className?: string
    /** Extra actions beside the primary submit button. */
    actions?: ReactNode
}

/**
 * Full-page form shell for auth/settings pages (non-modal) (#351).
 */
export function FormPage({
    title,
    onSubmit,
    children,
    formError,
    submitLabel = 'Save',
    isSubmitting = false,
    className,
    actions,
}: FormPageProps) {
    return (
        <div className={className}>
            {title ? <h1 className="h3 mb-3">{title}</h1> : null}
            <Form onSubmit={onSubmit} noValidate>
                {formError ? (
                    <Alert variant="danger" className="py-2">
                        {formError}
                    </Alert>
                ) : null}
                {children}
                <div className="d-flex flex-wrap gap-2 align-items-center">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        <FontAwesomeIcon icon={faCheckSquare} />
                        <span className="ms-1">
                            {isSubmitting ? 'Saving…' : submitLabel}
                        </span>
                    </Button>
                    {actions}
                </div>
            </Form>
        </div>
    )
}
