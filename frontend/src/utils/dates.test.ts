import { describe, expect, it } from 'vitest'
import { formatDisplayDate, toDateInputValue } from './dates'

describe('toDateInputValue', () => {
    it('returns empty string for nullish or empty values', () => {
        expect(toDateInputValue(null)).toBe('')
        expect(toDateInputValue(undefined)).toBe('')
        expect(toDateInputValue('')).toBe('')
    })

    it('extracts YYYY-MM-DD from ISO strings', () => {
        expect(toDateInputValue('2024-06-15T12:34:56.000Z')).toBe('2024-06-15')
        expect(toDateInputValue('2024-06-15')).toBe('2024-06-15')
    })

    it('formats Date objects as YYYY-MM-DD', () => {
        expect(toDateInputValue(new Date(2024, 5, 15))).toBe('2024-06-15')
    })

    it('returns empty string for invalid dates', () => {
        expect(toDateInputValue('not-a-date')).toBe('')
    })
})

describe('formatDisplayDate', () => {
    it('returns empty string for nullish or empty values', () => {
        expect(formatDisplayDate(null)).toBe('')
        expect(formatDisplayDate(undefined)).toBe('')
        expect(formatDisplayDate('')).toBe('')
    })

    it('keeps YYYY-MM-DD prefixes from API strings', () => {
        expect(formatDisplayDate('2024-06-15T00:00:00.000Z')).toBe('2024-06-15')
    })
})
