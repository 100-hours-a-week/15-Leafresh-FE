import { useCallback, useState } from 'react'

import { ENDPOINTS, fetchRequest, HttpMethod } from '@/shared/lib'

type PresignedUrlResponse = {
  uploadUrl: string // GCS로 PUT 요청을 보낼 PreSigned URL
  fileUrl: string // 버킷 내부에 저장될 객체 경로 (key)
}

export function useUploadImageToBucket() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    setLoading(true)
    setError(null)
    const uniqueId = crypto.randomUUID()
    const uniqueName = `${Date.now()}-${uniqueId}-${file.name}`

    try {
      const signed = await fetchRequest<PresignedUrlResponse>(ENDPOINTS.S3.PRESIGNED_URL, {
        body: {
          fileName: uniqueName,
          contentType: file.type,
        },
      })
      // 2) GCS에 PUT 요청으로 업로드
      const res = await fetch(signed.data.uploadUrl, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!res.ok) throw new Error(`GCS 업로드 실패: ${res.status}`)

      // 3) 최종 공개 URL 조립
      // GCS 기본 공개 URL 패턴: https://storage.googleapis.com/[BUCKET]/[OBJECT_NAME]
      return signed.data.fileUrl
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err)
        throw err
      }

      const fallbackError = new Error('알 수 없는 에러 발생')
      setError(fallbackError)
      throw fallbackError
    } finally {
      setLoading(false)
    }
  }, [])

  return { uploadFile, loading, error }
}
