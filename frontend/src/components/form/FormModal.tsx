import type { FormEventHandler, ReactNode } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons'

export interface FormModalProps {
    show: boolean
    title: string
    onHide: () => void
    onSubmit: FormEventHandler<HTMLFormElement>
    children: ReactNode
    /** Form-level error (e.g. ApiError Message without field Errors). */
    formError?: string
    submitLabel?: string
    /** When set, shows a cancel button next to submit. */
    cancelLabel?: string
    isSubmitting?: boolean
    size?: 'sm' | 'lg' | 'xl'
    /** Extra footer actions before the submit button. */
    footerExtra?: ReactNode
}

/**
 * Bootstrap modal form shell matching Pug `form.modal.fade` patterns (#351).
 */
export function FormModal({
    show,
    title,
    onHide,
    onSubmit,
    children,
    formError,
    submitLabel = 'Save',
    cancelLabel,
    isSubmitting = false,
    size,
    footerExtra,
}: FormModalProps) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size={size}
            scrollable
            backdrop="static"
            keyboard={!isSubmitting}
        >
            <Form onSubmit={onSubmit} noValidate>
                <Modal.Header closeButton={!isSubmitting}>
                    <Modal.Title as="h5">{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formError ? (
                        <Alert variant="danger" className="py-2">
                            {formError}
                        </Alert>
                    ) : null}
                    {children}
                    <div className="form-group text-center mt-3">
                        {cancelLabel ? (
                            <Button
                                variant="secondary"
                                type="button"
                                className="me-2"
                                onClick={onHide}
                                disabled={isSubmitting}
                            >
                                {cancelLabel}
                            </Button>
                        ) : null}
                        {footerExtra}
                        <button
                            type="submit"
                            className="btn text-primary"
                            disabled={isSubmitting}
                        >
                            <FontAwesomeIcon icon={faCheckSquare} />
                            <span className="ms-1">
                                {isSubmitting ? 'Saving…' : submitLabel}
                            </span>
                        </button>
                    </div>
                </Modal.Body>
            </Form>
        </Modal>
    )
}
