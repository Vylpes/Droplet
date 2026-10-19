import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiFetch, authApi, itemPurchasesApi } from './client'

describe('apiFetch', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('returns the body on success and always sends credentials', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ IsSuccess: true, Data: { Id: '1' } }),
        })
        vi.stubGlobal('fetch', fetchMock)

        const result = await apiFetch<{ Id: string }>('/api/demo', {
            method: 'POST',
            body: JSON.stringify({ a: 1 }),
        })

        expect(result.Data?.Id).toBe('1')
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/demo',
            expect.objectContaining({
                method: 'POST',
                credentials: 'include',
            })
        )
        const init = fetchMock.mock.calls[0][1] as RequestInit
        expect(new Headers(init.headers).get('Content-Type')).toBe(
            'application/json'
        )
    })

    it('throws ApiError when the response is unsuccessful', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 400,
                json: async () => ({
                    IsSuccess: false,
                    Message: 'Nope',
                    Errors: { email: 'bad' },
                }),
            })
        )

        await expect(apiFetch('/api/demo')).rejects.toMatchObject({
            name: 'ApiError',
            status: 400,
            message: 'Nope',
        })

        try {
            await apiFetch('/api/demo')
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError)
            expect((error as ApiError).fieldErrors).toEqual({ email: 'bad' })
        }
    })
})

describe('API wrappers', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('authApi.login posts credentials to /api/auth/login', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ IsSuccess: true, Data: { Email: 'a@b.com' } }),
        })
        vi.stubGlobal('fetch', fetchMock)

        await authApi.login('a@b.com', 'secret')

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/login',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ email: 'a@b.com', password: 'secret' }),
            })
        )
    })

    it('itemPurchasesApi.list hits the status path', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ IsSuccess: true, Data: [] }),
        })
        vi.stubGlobal('fetch', fetchMock)

        await itemPurchasesApi.list('ordered')

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/item-purchases/ordered',
            expect.objectContaining({ credentials: 'include' })
        )
    })

    it('authApi.validateVerifyToken encodes the token query', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ IsSuccess: true, Data: {} }),
        })
        vi.stubGlobal('fetch', fetchMock)

        await authApi.validateVerifyToken('a b/c')

        expect(fetchMock.mock.calls[0][0]).toBe(
            '/api/auth/verify?token=a%20b%2Fc'
        )
    })
})
