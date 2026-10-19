import { render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { FormField } from './FormField'

function FieldHarness({
    errorMessage,
}: {
    errorMessage?: string
}) {
    const { control, setError } = useForm({
        defaultValues: { email: '' },
    })

    useEffect(() => {
        if (errorMessage) {
            setError('email', { type: 'server', message: errorMessage })
        }
    }, [errorMessage, setError])

    return (
        <FormField control={control} name="email" label="Email" type="email" />
    )
}

describe('FormField', () => {
    it('renders the label and input', () => {
        render(<FieldHarness />)

        expect(screen.getByLabelText('Email')).toBeInTheDocument()
        expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    })

    it('shows invalid feedback when the field has an error', async () => {
        render(<FieldHarness errorMessage="Email is required" />)

        expect(await screen.findByText('Email is required')).toBeInTheDocument()
        expect(screen.getByLabelText('Email')).toHaveClass('is-invalid')
    })
})
