import { FormField, FormModal, useApiForm } from './form'
import { addNoteSchema } from '../validation'

export interface AddNoteModalProps {
    show: boolean
    onHide: () => void
    onSubmit: (text: string) => Promise<void>
    onSuccess?: () => void
}

export function AddNoteModal({
    show,
    onHide,
    onSubmit,
    onSuccess,
}: AddNoteModalProps) {
    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: addNoteSchema,
        defaultValues: { text: '' },
        onSubmit: async (values) => {
            await onSubmit(values.text)
        },
        onSuccess: async () => {
            form.reset({ text: '' })
            onHide()
            await onSuccess?.()
        },
    })

    return (
        <FormModal
            show={show}
            title="Add Note"
            onHide={onHide}
            onSubmit={submit}
            formError={formError}
            submitLabel="Add"
            isSubmitting={isSubmitting}
        >
            <FormField control={form.control} name="text" label="Text" />
        </FormModal>
    )
}
