import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ApiError } from '../../api/client'
import { FormField } from './FormField'
import { useApiForm } from './useApiForm'

const schema = z.object({
    email: z.string().min(1, 'Email is required'),
})

function Harness({
    onSubmit,
    onSuccess,
}: {
    onSubmit: (values: { email: string }) => Promise<void>
    onSuccess?: (values: { email: string }) => void
}) {
    const { form, submit, formError } = useApiForm({
        schema,
        defaultValues: { email: '' },
        onSubmit,
        onSuccess,
    })

    return (
        <form onSubmit={submit}>
            {formError ? <div role="alert">{formError}</div> : null}
            <FormField control={form.control} name="email" label="Email" />
            <button type="submit">Save</button>
        </form>
    )
}

describe('useApiForm', () => {
    it('calls onSubmit and onSuccess with validated values', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockResolvedValue(undefined)
        const onSuccess = vi.fn()

        render(<Harness onSubmit={onSubmit} onSuccess={onSuccess} />)

        await user.type(screen.getByLabelText('Email'), 'a@b.com')
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com' })
        expect(onSuccess).toHaveBeenCalledWith({ email: 'a@b.com' })
    })

    it('blocks submit when Zod validation fails', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        render(<Harness onSubmit={onSubmit} />)

        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(onSubmit).not.toHaveBeenCalled()
        expect(screen.getByText('Email is required')).toBeInTheDocument()
    })

    it('maps ApiError field errors onto the form', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockRejectedValue(
            new ApiError(400, {
                IsSuccess: false,
                Message: 'Validation failed',
                Errors: { email: 'Already taken' },
            })
        )

        render(<Harness onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText('Email'), 'a@b.com')
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(await screen.findByText('Already taken')).toBeInTheDocument()
    })

    it('surfaces root ApiError messages as formError', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockRejectedValue(
            new ApiError(500, {
                IsSuccess: false,
                Message: 'Server exploded',
            })
        )

        render(<Harness onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText('Email'), 'a@b.com')
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Server exploded'
        )
    })
})
