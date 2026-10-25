import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DataTable } from './DataTable'
import { createAppColumnHelper } from './tableHook'

type Row = { Id: string; Name: string }

const helper = createAppColumnHelper<Row>()
const columns = helper.columns([
    helper.accessor('Name', { header: 'Name' }),
])

describe('DataTable', () => {
    it('shows the empty message when there are no rows', () => {
        render(<DataTable data={[]} columns={columns} />)

        expect(
            screen.getByText('No matching records found')
        ).toBeInTheDocument()
        expect(screen.getByText(/showing 0 to 0 of 0 entries/i)).toBeInTheDocument()
    })

    it('renders rows and filters via search', async () => {
        const user = userEvent.setup()
        render(
            <DataTable
                data={[
                    { Id: '1', Name: 'Alpha' },
                    { Id: '2', Name: 'Beta' },
                ]}
                columns={columns}
                getRowId={(row) => row.Id}
            />
        )

        expect(screen.getByText('Alpha')).toBeInTheDocument()
        expect(screen.getByText('Beta')).toBeInTheDocument()

        await user.type(screen.getByLabelText('Search'), 'alp')

        expect(screen.getByText('Alpha')).toBeInTheDocument()
        expect(screen.queryByText('Beta')).toBeNull()
        expect(screen.getByText(/filtered from 2 total entries/i)).toBeInTheDocument()
    })

    it('disables previous/next pagination on a single page', () => {
        const { container } = render(
            <DataTable
                data={[{ Id: '1', Name: 'Only' }]}
                columns={columns}
                getRowId={(row) => row.Id}
            />
        )

        // react-bootstrap renders disabled pager items as non-interactive spans
        expect(container.querySelectorAll('.page-item.disabled')).toHaveLength(2)
        expect(screen.getByText('Previous')).toBeInTheDocument()
        expect(screen.getByText('Next')).toBeInTheDocument()
    })
})
