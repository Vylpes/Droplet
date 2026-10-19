import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DetailField } from './DetailField'

describe('DetailField', () => {
    it('renders the label and children', () => {
        render(<DetailField label="Order Number">ORD-123</DetailField>)

        expect(screen.getByText('Order Number')).toBeInTheDocument()
        expect(screen.getByText('ORD-123')).toBeInTheDocument()
    })
})
