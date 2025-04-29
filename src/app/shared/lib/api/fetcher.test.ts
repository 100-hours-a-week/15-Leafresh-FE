import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetcher } from './fetcher'

describe('fetcher 유틸', () => {
  beforeEach(() => {
    // globalThis.fetch를 Vitest mock 함수로 교체
    globalThis.fetch = vi.fn()
  })

  it('ERROR: ok가 false면 FetchError를 던진다', async () => {
    // (1) mockResolvedValueOnce에 타입 캐스팅
    ;(globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 403,
      headers: { get: (_: string) => 'application/json' },
      json: async () => ({ status: 403, message: 'forbidden', data: null }),
      text: async () => '',
    })

    await expect(fetcher.get<null>('/forbidden'))
      .rejects
      // (2) 제네릭 제거
      .toMatchObject({
        response: expect.objectContaining({ status: 403 }),
        data: { status: 403, message: 'forbidden', data: null }
      })
  })

  it('POST: body를 JSON.stringify하여 전송한다', async () => {
    let capturedInit!: RequestInit;

    ;(globalThis.fetch as unknown as ReturnType<typeof vi.fn>)
      // (3) 파라미터에 타입 선언
      .mockImplementationOnce((_: unknown, init: RequestInit) => {
        capturedInit = init
        return Promise.resolve({
          ok: true,
          status: 201,
          headers: { get: (_: string) => 'application/json' },
          json: async () => ({ status: 201, message: 'created', data: { id: 42 } }),
          text: async () => ''
        })
      })

    const payload = { foo: 'bar' }
    const res = await fetcher.post<{ id: number }>('/items', payload)

    expect(capturedInit.method).toBe('POST')
    expect((capturedInit.headers as Record<string, string>)['Content-Type'])
      .toBe('application/json')
    expect(capturedInit.body).toBe(JSON.stringify(payload))
    expect(res.data).toEqual({ id: 42 })
  })
})
