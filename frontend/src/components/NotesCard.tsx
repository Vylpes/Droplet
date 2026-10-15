import type { NoteDto } from '@droplet/shared'
import Card from 'react-bootstrap/Card'

function formatNoteDate(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) {
        return String(value)
    }
    return date.toLocaleString()
}

export function NotesCard({ notes }: { notes: NoteDto[] }) {
    return (
        <Card>
            <Card.Header>Notes</Card.Header>
            <Card.Body>
                {notes.length === 0 ? (
                    <p className="text-muted mb-0">No notes yet.</p>
                ) : (
                    notes.map((note, index) => (
                        <div key={note.Id}>
                            <p className="mb-1">{note.Text}</p>
                            <p className="text-secondary mb-0">
                                - {formatNoteDate(note.WhenCreated)}
                            </p>
                            {index < notes.length - 1 ? <hr /> : null}
                        </div>
                    ))
                )}
            </Card.Body>
        </Card>
    )
}
