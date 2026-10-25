import { z } from 'zod'
import {
    emailAddress,
    equalToField,
    minLength,
    minNumber,
    numberField,
    requiredString,
} from './rules'

/**
 * Auth / account form schemas (#352).
 * Prefer co-locating page-specific extras with pages when needed.
 */

export const loginSchema = z.object({
    email: emailAddress('email'),
    password: requiredString('password'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const emailOnlySchema = z.object({
    email: emailAddress('email'),
})

export type EmailOnlyFormValues = z.infer<typeof emailOnlySchema>

/** Verify / password-reset: API requires min 8 chars. */
export const passwordPairSchema = z
    .object({
        password: minLength('password', 8),
        passwordRepeat: requiredString('passwordRepeat'),
    })
    .refine(equalToField('passwordRepeat', 'password'), {
        path: ['passwordRepeat'],
        error: 'Passwords must match',
    })

export type PasswordPairFormValues = z.infer<typeof passwordPairSchema>

export const adminRegisterSchema = z
    .object({
        username: requiredString('username'),
        email: emailAddress('email'),
        password: requiredString('password'),
        passwordRepeat: requiredString('passwordRepeat'),
    })
    .refine(equalToField('passwordRepeat', 'password'), {
        path: ['passwordRepeat'],
        error: 'Passwords do not match',
    })

export type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>

export const accountSettingsSchema = z
    .object({
        email: emailAddress('email'),
        username: requiredString('username'),
        newPassword: z.string().optional().default(''),
        passwordConfirm: z.string().optional().default(''),
        currentPassword: requiredString('currentPassword'),
    })
    .refine(
        (data) =>
            !data.newPassword || data.newPassword === data.passwordConfirm,
        {
            path: ['passwordConfirm'],
            error: 'Passwords must match',
        }
    )

export type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>

export const addNoteSchema = z.object({
    text: requiredString('text'),
})

export type AddNoteFormValues = z.infer<typeof addNoteSchema>

export const purchaseFormSchema = z.object({
    description: requiredString('description'),
    price: numberField('price'),
})

export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>

export const purchaseStatusSchema = z.object({
    status: numberField('status'),
})

export type PurchaseStatusFormValues = z.infer<typeof purchaseStatusSchema>

export const newItemSchema = z.object({
    name: requiredString('name'),
    quantity: minNumber('quantity', 0),
})

export type NewItemFormValues = z.infer<typeof newItemSchema>

export const editItemSchema = z.object({
    name: requiredString('name'),
})

export type EditItemFormValues = z.infer<typeof editItemSchema>

export const itemQuantitySchema = z.object({
    unlisted: minNumber('unlisted', 0),
    listed: minNumber('listed', 0),
    sold: minNumber('sold', 0),
    rejected: minNumber('rejected', 0),
})

export type ItemQuantityFormValues = z.infer<typeof itemQuantitySchema>

export const newSupplySchema = z.object({
    name: requiredString('name'),
    sku: requiredString('sku'),
    quantity: minNumber('quantity', 0),
})

export type NewSupplyFormValues = z.infer<typeof newSupplySchema>

export const editSupplySchema = z.object({
    name: requiredString('name'),
    sku: requiredString('sku'),
})

export type EditSupplyFormValues = z.infer<typeof editSupplySchema>

export const supplyQuantitySchema = z.object({
    unused: minNumber('unused', 0),
    used: minNumber('used', 0),
})

export type SupplyQuantityFormValues = z.infer<typeof supplyQuantitySchema>

/** Confirm-only workflow modals (end listing, mark paid, etc.). */
export const confirmActionSchema = z.object({})

export type ConfirmActionFormValues = z.infer<typeof confirmActionSchema>

export const newListingSchema = z.object({
    listingNumber: requiredString('listingNumber'),
    name: requiredString('name'),
    itemId: requiredString('itemId'),
    price: numberField('price'),
    endDate: requiredString('endDate'),
    quantity: minNumber('quantity', 0),
})

export type NewListingFormValues = z.infer<typeof newListingSchema>

export const editListingSchema = z.object({
    name: requiredString('name'),
    listingNumber: requiredString('listingNumber'),
    price: numberField('price'),
    quantity: minNumber('quantity', 0),
})

export type EditListingFormValues = z.infer<typeof editListingSchema>

export const renewListingSchema = z.object({
    endDate: requiredString('endDate'),
})

export type RenewListingFormValues = z.infer<typeof renewListingSchema>

export const assignListingItemSchema = z.object({
    itemId: requiredString('itemId'),
})

export type AssignListingItemFormValues = z.infer<
    typeof assignListingItemSchema
>

export const assignPostagePolicySchema = z.object({
    policyId: requiredString('policyId'),
})

export type AssignPostagePolicyFormValues = z.infer<
    typeof assignPostagePolicySchema
>

export const newOrderSchema = z.object({
    orderNumber: requiredString('orderNumber'),
    buyer: requiredString('buyer'),
    offerAccepted: requiredString('offerAccepted'),
    listingId: requiredString('listingId'),
    postagePolicyId: requiredString('postagePolicyId'),
    amount: numberField('amount'),
})

export type NewOrderFormValues = z.infer<typeof newOrderSchema>

export const editOrderSchema = z.object({
    orderNumber: requiredString('orderNumber'),
    buyer: requiredString('buyer'),
    offerAccepted: requiredString('offerAccepted'),
    postagePolicyId: z.string().optional().default(''),
})

export type EditOrderFormValues = z.infer<typeof editOrderSchema>

export const assignOrderListingSchema = z.object({
    listingId: requiredString('listingId'),
    amount: numberField('amount'),
})

export type AssignOrderListingFormValues = z.infer<
    typeof assignOrderListingSchema
>

export const assignOrderSupplySchema = z.object({
    supplyId: requiredString('supplyId'),
    amount: numberField('amount'),
})

export type AssignOrderSupplyFormValues = z.infer<
    typeof assignOrderSupplySchema
>

export const assignTrackingSchema = z.object({
    number: requiredString('number'),
    service: numberField('service'),
})

export type AssignTrackingFormValues = z.infer<typeof assignTrackingSchema>

export const orderDiscountSchema = z.object({
    amount: numberField('amount'),
})

export type OrderDiscountFormValues = z.infer<typeof orderDiscountSchema>

export const newReturnSchema = z.object({
    returnNumber: requiredString('returnNumber'),
    orderId: requiredString('orderId'),
    trackingService: numberField('trackingService'),
    trackingNumber: requiredString('trackingNumber'),
})

export type NewReturnFormValues = z.infer<typeof newReturnSchema>

export const editReturnSchema = z.object({
    returnNumber: requiredString('returnNumber'),
    returnBy: requiredString('returnBy'),
})

export type EditReturnFormValues = z.infer<typeof editReturnSchema>

export const returnBySchema = z.object({
    returnBy: requiredString('returnBy'),
})

export type ReturnByFormValues = z.infer<typeof returnBySchema>

export const returnRefundSchema = z.object({
    refundAmount: numberField('refundAmount'),
})

export type ReturnRefundFormValues = z.infer<typeof returnRefundSchema>

export const newStorageSchema = z.object({
    name: requiredString('name'),
    skuPrefix: requiredString('skuPrefix'),
})

export type NewStorageFormValues = z.infer<typeof newStorageSchema>

export const assignStorageItemSchema = z.object({
    itemId: requiredString('itemId'),
})

export type AssignStorageItemFormValues = z.infer<
    typeof assignStorageItemSchema
>

export const postagePolicyFormSchema = z.object({
    name: requiredString('name'),
    costToBuyer: numberField('costToBuyer'),
    actualCost: numberField('actualCost'),
})

export type PostagePolicyFormValues = z.infer<typeof postagePolicyFormSchema>

export const newUserSchema = z.object({
    username: requiredString('username'),
    email: emailAddress('email'),
    admin: requiredString('admin'),
})

export type NewUserFormValues = z.infer<typeof newUserSchema>

export const editUserSchema = z.object({
    username: requiredString('username'),
    email: emailAddress('email'),
    admin: requiredString('admin'),
    active: requiredString('active'),
})

export type EditUserFormValues = z.infer<typeof editUserSchema>