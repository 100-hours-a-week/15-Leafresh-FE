import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetcher } from './fetcher'
import type { ApiResponse, ErrorResponse } from './fetcher'

describe('fetcher.request', () => {
  beforeEach(() => {
    // global.fetch를 Vitest mock 함수로 교체
    globalThis.fetch = vi.fn()
  })

  it('JSON 성공 응답을 반환한다', async () => {
    const mockData: ApiResponse<number[]> = {
      status: 200,
      message: 'ok',
      data: [1, 2, 3],
    }
    ;(globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockData,
      text: async () => '',
    })

    const res = await fetcher.request<ApiResponse<number[]>>(
      () => ({ method: 'GET', path: '/dummy' })
    )
    expect(res).toEqual(mockData)
  })

  it('text/plain 응답은 text() 결과를 반환한다', async () => {
    ;(globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'text/plain' },
      json: async () => { throw new Error('json 호출되지 않아야 함') },
      text: async () => 'hello world',
    })

    const res = await fetcher.request<string>(
      () => ({ method: 'GET', path: '/dummy' })
    )
    expect(res).toBe('hello world')
  })

  it('query 파라미터를 URL에 잘 붙인다', async () => {
    let capturedUrl: string | null = null

    ;(globalThis.fetch as any).mockImplementationOnce((input: string) => {
      capturedUrl = input
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ status: 200, message: 'ok', data: null }),
        text: async () => '',
      })
    })

    await fetcher.request<ErrorResponse>(
      () => ({ method: 'GET', path: '/items' }),
      { query: { a: 1, b: 'two' } }
    )
    expect(capturedUrl).toContain('/items?a=1&b=two')
  })

  it('JSON body를 stringify하여 전송한다', async () => {
    let capturedInit!: RequestInit

    ;(globalThis.fetch as any).mockImplementationOnce((input: unknown, init: RequestInit) => {
      capturedInit = init
      return Promise.resolve({
        ok: true,
        status: 201,
        headers: { get: () => 'application/json' },
        json: async () => ({ status: 201, message: 'created', data: { id: 42 } }),
        text: async () => '',
      })
    })

    const payload = { foo: 'bar' }
    const res = await fetcher.request<ApiResponse<{ id: number }>>(
      () => ({ method: 'POST', path: '/create' }),
      { body: payload }
    )

    expect(capturedInit.method).toBe('POST')
    expect(
      (capturedInit.headers as Record<string, string>)['Content-Type']
    ).toBe('application/json')
    expect(capturedInit.body).toBe(JSON.stringify(payload))
    expect(res.data).toEqual({ id: 42 })
  })

  it('FormData body 전송 시 Content-Type 미설정', async () => {
    let capturedInit!: RequestInit

    ;(globalThis.fetch as any).mockImplementationOnce((input: unknown, init: RequestInit) => {
      capturedInit = init
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({}),
        text: async () => '',
      })
    })

    const fd = new FormData()
    fd.append('file', new Blob([''], { type: 'text/plain' }), 'test.txt')

    await fetcher.request<{}>(
      () => ({ method: 'POST', path: '/upload' }),
      { body: fd }
    )

    expect(capturedInit.headers).not.toHaveProperty('Content-Type')
    expect(capturedInit.body).toBe(fd)
  })

  it('JSON 에러 응답일 때 ErrorResponse를 throw한다', async () => {
    ;(globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'bad request' }),
      text: async () => '',
    })

    await expect(
      fetcher.request<unknown>(() => ({ method: 'GET', path: '/err' }))
    ).rejects.toMatchObject({
      status: 400,
      message: 'bad request',
      data: null,
    })
  })

  it('text/plain 에러 시 Unknown error 메시지를 갖는다', async () => {
    ;(globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: { get: () => 'text/plain' },
      json: async () => { throw new Error('no json') },
      text: async () => 'server down',
    })

    await expect(
      fetcher.request<unknown>(() => ({ method: 'DELETE', path: '/err' }))
    ).rejects.toMatchObject({
      status: 500,
      message: 'Unknown error',
      data: null,
    })
  })
})
