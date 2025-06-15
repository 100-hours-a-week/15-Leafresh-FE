// src/shared/lib/fetcher.test.ts
import { beforeEach, describe, expect, it, MockedFunction, vi } from 'vitest'

import type { EndpointType } from '../../../constants/endpoint'
import { HttpMethod, HttpStatusCode } from '../../../constants/http'
import { ApiResponse, ErrorResponse } from '../type'
import { clientFetchRequest } from './client-fetcher'

describe('clientFetchRequest 유틸', () => {
  let fetchMock: MockedFunction<typeof fetch>

  beforeEach(() => {
    fetchMock = vi.spyOn(globalThis, 'fetch') as MockedFunction<typeof fetch>
  })

  it('GET JSON 성공 응답을 반환한다', async () => {
    const endpoint: EndpointType = { method: HttpMethod.GET, path: '/dummy' }
    const mockData: ApiResponse<number[]> = {
      status: HttpStatusCode.SUCCESS,
      message: 'ok',
      data: [1, 2, 3],
    }

    fetchMock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          status: HttpStatusCode.SUCCESS,
          headers: { get: () => 'application/json' },
          json: async () => mockData,
          text: async () => '',
        }) as unknown as Response,
    )

    const res = await clientFetchRequest<ApiResponse<number[]>>(endpoint)
    expect(res).toEqual(mockData)
  })

  it('GET text/plain 응답은 텍스트 결과를 반환한다', async () => {
    const endpoint: EndpointType = { method: HttpMethod.GET, path: '/txt' }

    fetchMock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          status: HttpStatusCode.SUCCESS,
          headers: { get: () => 'text/plain' },
          json: async () => {
            throw new Error('Should not call JSON')
          },
          text: async () => 'plain text',
        }) as unknown as Response,
    )

    const res = await clientFetchRequest<string>(endpoint)
    expect(res).toBe('plain text')
  })

  it('쿼리 파라미터를 URL에 붙여 전송한다', async () => {
    const endpoint: EndpointType = { method: HttpMethod.GET, path: '/items' }
    let capturedUrl = ''

    fetchMock.mockImplementationOnce(async input => {
      capturedUrl = String(input)
      return {
        ok: true,
        status: HttpStatusCode.SUCCESS,
        headers: { get: () => 'application/json' },
        json: async () => ({ status: HttpStatusCode.SUCCESS, message: 'ok', data: null }),
        text: async () => '',
      } as unknown as Response
    })

    await clientFetchRequest<ErrorResponse>(endpoint, { query: { a: 1, b: 'two' } })
    expect(capturedUrl).toContain('/items?a=1&b=two')
  })

  it('POST JSON body를 stringify하여 전송한다', async () => {
    const endpoint: EndpointType = { method: HttpMethod.POST, path: '/create' }
    let capturedInit!: RequestInit

    fetchMock.mockImplementationOnce(async (_input, init) => {
      capturedInit = init!
      return {
        ok: true,
        status: HttpStatusCode.Created,
        headers: { get: () => 'application/json' },
        json: async () => ({ status: HttpStatusCode.Created, message: 'created', data: { id: 42 } }),
        text: async () => '',
      } as unknown as Response
    })

    const payload = { foo: 'bar' }
    const res = await clientFetchRequest<ApiResponse<{ id: number }>>(endpoint, { body: payload })

    expect(capturedInit.method).toBe(HttpMethod.POST)
    expect((capturedInit.headers as Record<string, string>)['Content-Type']).toBe('application/json')
    expect(capturedInit.body).toBe(JSON.stringify(payload))
    expect(res.data).toEqual({ id: 42 })
  })

  it('FormData 전송 시 Content-Type 헤더가 설정되지 않는다', async () => {
    const endpoint: EndpointType = { method: HttpMethod.POST, path: '/upload' }
    let capturedInit!: RequestInit

    fetchMock.mockImplementationOnce(async (_input, init) => {
      capturedInit = init!
      return {
        ok: true,
        status: HttpStatusCode.SUCCESS,
        headers: { get: () => 'application/json' },
        json: async () => ({ status: HttpStatusCode.SUCCESS, message: 'ok', data: {} }),
        text: async () => '',
      } as unknown as Response
    })

    const fd = new FormData()
    fd.append('file', new Blob([''], { type: 'text/plain' }), 'test.txt')
    await clientFetchRequest<object>(endpoint, { body: fd })

    expect(capturedInit.headers).not.toHaveProperty('Content-Type')
    expect(capturedInit.body).toBe(fd)
  })

  it('JSON 에러 응답 시 ErrorResponse 형식으로 throw된다', async () => {
    const endpoint: EndpointType = { method: HttpMethod.GET, path: '/err-json' }

    fetchMock.mockImplementationOnce(
      async () =>
        ({
          ok: false,
          status: HttpStatusCode.BadRequest,
          headers: { get: () => 'application/json' },
          json: async () => ({ message: 'bad request' }),
          text: async () => '',
        }) as unknown as Response,
    )

    await expect(clientFetchRequest<unknown>(endpoint)).rejects.toMatchObject({
      status: HttpStatusCode.BadRequest,
      message: 'bad request',
      data: null,
    })
  })

  it('text/plain 에러 응답 시 Unknown error 메시지를 갖는다', async () => {
    const endpoint: EndpointType = { method: HttpMethod.DELETE, path: '/err-txt' }

    fetchMock.mockImplementationOnce(
      async () =>
        ({
          ok: false,
          status: HttpStatusCode.InternalServerError,
          headers: { get: () => 'text/plain' },
          json: async () => {
            throw new Error('not json')
          },
          text: async () => 'server down',
        }) as unknown as Response,
    )

    await expect(clientFetchRequest<unknown>(endpoint)).rejects.toMatchObject({
      status: HttpStatusCode.InternalServerError,
      message: 'Unknown error',
      data: null,
    })
  })
})
