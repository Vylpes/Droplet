import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FormModal } from './FormModal'

describe('FormModal', () => {
    it('renders title, children, and form error when shown', () => {
        render(
            <FormModal
                show
                title="Edit Item"
                onHide={vi.fn()}
                onSubmit={(e) => e.preventDefault()}
                formError="Something failed"
                submitLabel="Save Item"
            >
                <p>Body field</p>
            </FormModal>
        )

        expect(screen.getByText('Edit Item')).toBeInTheDocument()
        expect(screen.getByText('Body field')).toBeInTheDocument()
        expect(screen.getByText('Something failed')).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: /save item/i })
        ).toBeInTheDocument()
    })

    it('shows Saving… and disables actions while submitting', () => {
        render(
            <FormModal
                show
                title="Edit Item"
                onHide={vi.fn()}
                onSubmit={(e) => e.preventDefault()}
                cancelLabel="Cancel"
                isSubmitting
            >
                <div />
            </FormModal>
        )

        expect(
            screen.getByRole('button', { name: /saving/i })
        ).toBeDisabled()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
    })

    it('calls onHide from cancel', async () => {
        const user = userEvent.setup()
        const onHide = vi.fn()

        render(
            <FormModal
                show
                title="Edit Item"
                onHide={onHide}
                onSubmit={(e) => e.preventDefault()}
                cancelLabel="Cancel"
            >
                <div />
            </FormModal>
        )

        await user.click(screen.getByRole('button', { name: /cancel/i }))
        expect(onHide).toHaveBeenCalledOnce()
    })
})
