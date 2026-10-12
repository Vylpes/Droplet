import { useId, type ReactNode } from 'react'
import Form from 'react-bootstrap/Form'
import {
    Controller,
    type Control,
    type FieldPath,
    type FieldValues,
    type RegisterOptions,
} from 'react-hook-form'

type NativeInputType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'url'
    | 'tel'
    | 'search'

export interface FormFieldProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>
    name: FieldPath<TFieldValues>
    label: string
    type?: NativeInputType
    as?: 'input' | 'textarea' | 'select'
    placeholder?: string
    helpText?: string
    disabled?: boolean
    className?: string
    rows?: number
    step?: string | number
    children?: ReactNode
    rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
}

/**
 * Bootstrap Form.Group wired to react-hook-form with invalid feedback (#351).
 */
export function FormField<TFieldValues extends FieldValues>({
    control,
    name,
    label,
    type = 'text',
    as = 'input',
    placeholder,
    helpText,
    disabled,
    className,
    rows = 3,
    step,
    children,
    rules,
}: FormFieldProps<TFieldValues>) {
    const inputId = useId()

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => {
                const isInvalid = Boolean(fieldState.error)
                const common = {
                    ...field,
                    id: inputId,
                    disabled,
                    placeholder,
                    isInvalid,
                    value: field.value ?? '',
                }

                let controlEl: ReactNode
                if (as === 'textarea') {
                    controlEl = (
                        <Form.Control
                            {...common}
                            as="textarea"
                            rows={rows}
                        />
                    )
                } else if (as === 'select') {
                    controlEl = (
                        <Form.Select {...common}>{children}</Form.Select>
                    )
                } else {
                    controlEl = (
                        <Form.Control {...common} type={type} step={step} />
                    )
                }

                return (
                    <Form.Group className={className ?? 'mb-3'} controlId={inputId}>
                        <Form.Label>{label}</Form.Label>
                        {controlEl}
                        {helpText ? (
                            <Form.Text muted>{helpText}</Form.Text>
                        ) : null}
                        <Form.Control.Feedback type="invalid">
                            {fieldState.error?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                )
            }}
        />
    )
}
