/** Format API date values for `<input type="date">`. */
export function toDateInputValue(
    value: Date | string | null | undefined
): string {
    if (value == null || value === '') return ''
    if (typeof value === 'string') {
        const match = value.match(/^(\d{4}-\d{2}-\d{2})/)
        if (match) return match[1]
    }
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/** Compact display for list/detail date fields. */
export function formatDisplayDate(
    value: Date | string | null | undefined
): string {
    if (value == null || value === '') return ''
    const asString = String(value)
    const match = asString.match(/^(\d{4}-\d{2}-\d{2})/)
    if (match) return match[1]
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return asString
    return date.toLocaleDateString()
}
