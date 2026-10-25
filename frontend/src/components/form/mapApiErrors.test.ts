import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../api/client'
import { mapApiErrorsToForm } from './mapApiErrors'

describe('mapApiErrorsToForm', () => {
    it('maps field errors from ApiError onto the form', () => {
        const setError = vi.fn()
        const error = new ApiError(400, {
            IsSuccess: false,
            Message: 'Validation failed',
            Errors: {
                Email: 'Email is required',
                Password: 'Password is too short',
            },
        })

        const message = mapApiErrorsToForm(error, setError)

        expect(message).toBe('Validation failed')
        expect(setError).toHaveBeenCalledWith('Email', {
            type: 'server',
            message: 'Email is required',
        })
        expect(setError).toHaveBeenCalledWith('Password', {
            type: 'server',
            message: 'Password is too short',
        })
    })

    it('falls back to a root error when only Message is present', () => {
        const setError = vi.fn()
        const error = new ApiError(401, {
            IsSuccess: false,
            Message: 'Invalid credentials',
        })

        const message = mapApiErrorsToForm(error, setError)

        expect(message).toBe('Invalid credentials')
        expect(setError).toHaveBeenCalledWith('root', {
            type: 'server',
            message: 'Invalid credentials',
        })
    })

    it('handles non-ApiError failures as root errors', () => {
        const setError = vi.fn()

        const message = mapApiErrorsToForm(new Error('Network down'), setError)

        expect(message).toBe('Network down')
        expect(setError).toHaveBeenCalledWith('root', {
            type: 'server',
            message: 'Network down',
        })
    })
})
