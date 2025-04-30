// src/shared/lib/fetcher.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchRequest, ApiResponse, ErrorResponse } from './fetcher'
import type { EndpointType } from '@shared/constants/endpoint'

describe('fetchRequest 유틸', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  it('GET JSON 성공 응답을 반환한다', async () => {
    const fakeEndpoint = { method: 'GET', path: '/dummy' } as EndpointType
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

    const res = await fetchRequest<ApiResponse<number[]>>(fakeEndpoint)
    expect(res).toEqual(mockData)
  })

  it('GET text/plain 응답은 텍스트 결과를 반환한다', async () => {
    const fakeEndpoint = { method: 'GET', path: '/txt' } as EndpointType

    ;(globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'text/plain' },
      json: async () => { throw new Error('json 호출되지 않아야 함') },
      text: async () => 'plain text',
    })

    const res = await fetchRequest<string>(fakeEndpoint)
    expect(res).toBe('plain text')
  })

  it('쿼리 파라미터를 URL에 붙여 전송한다', async () => {
    const fakeEndpoint = { method: 'GET', path: '/items' } as EndpointType
    let capturedUrl = ''

    ;(globalThis.fetch as any).mockImplementationOnce((url: RequestInfo) => {
      capturedUrl = String(url)
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ status: 200, message: 'ok', data: null }),
        text: async () => '',
      })
    })

    await fetchRequest<ErrorResponse>(fakeEndpoint, { query: { a: 1, b: 'two' } })
    expect(capturedUrl).toContain('/items?a=1&b=two')
  })

  it('POST JSON body를 stringify하여 전송한다', async () => {
    const fakeEndpoint = { method: 'POST', path: '/create' } as EndpointType
    let capturedInit!: RequestInit

    ;(globalThis.fetch as any).mockImplementationOnce((input: RequestInfo, init: RequestInit) => {
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
    const res = await fetchRequest<ApiResponse<{ id: number }>>(fakeEndpoint, { body: payload })

    expect(capturedInit.method).toBe('POST')
    expect(
      (capturedInit.headers as Record<string, string>)['Content-Type']
    ).toBe('application/json')
    expect(capturedInit.body).toBe(JSON.stringify(payload))
    expect(res.data).toEqual({ id: 42 })
  })

  it('FormData 전송 시 Content-Type 헤더가 설정되지 않는다', async () => {
    const fakeEndpoint = { method: 'POST', path: '/upload' } as EndpointType
    let capturedInit!: RequestInit

    ;(globalThis.fetch as any).mockImplementationOnce((input: RequestInfo, init: RequestInit) => {
      capturedInit = init
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ status: 200, message: 'ok', data: {} }),
        text: async () => '',
      })
    })

    const fd = new FormData()
    fd.append('file', new Blob([''], { type: 'text/plain' }), 'test.txt')
    await fetchRequest<object>(fakeEndpoint, { body: fd })

    expect(capturedInit.headers).not.toHaveProperty('Content-Type')
    expect(capturedInit.body).toBe(fd)
  })

  it('JSON 에러 응답일 때 ErrorResponse를 throw한다', async () => {
    const fakeEndpoint = { method: 'GET', path: '/err-json' } as EndpointType

    ;(globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'bad request' }),
      text: async () => '',
    })

    await expect(fetchRequest<unknown>(fakeEndpoint))
      .rejects.toMatchObject({
        status: 400,
        message: 'bad request',
        data: null,
      })
  })

  it('text/plain 에러 응답 시 Unknown error 메시지를 갖는다', async () => {
    const fakeEndpoint = { method: 'DELETE', path: '/err-txt' } as EndpointType

    ;(globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: { get: () => 'text/plain' },
      json: async () => { throw new Error('no json') },
      text: async () => 'server down',
    })

    await expect(fetchRequest<unknown>(fakeEndpoint))
      .rejects.toMatchObject({
        status: 500,
        message: 'Unknown error',
        data: null,
      })
  })
})
