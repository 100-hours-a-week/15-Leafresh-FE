import { useCallback, useState } from 'react'

import { ENDPOINTS, fetchRequest, HttpMethod } from '@/shared/lib'

type PresignedUrlResponse = {
  uploadUrl: string // PresignedURL
  fileUrl: string // 버킷 내부 이미지 실제 경로
}

/**
 * 버킷에 이미지를 업로드하고, 업로드된 이미지 경로를 받아오는 커스텀 훅
 * @returns 업로드된 이미지 경로
 */
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true)
    setError(null)
    const uniqueId = crypto.randomUUID()
    const uniqueName = `${Date.now()}-${uniqueId}-${file.name}`

    try {
      const presignedResponse = await fetchRequest<PresignedUrlResponse>(ENDPOINTS.S3.PRESIGNED_URL, {
        body: {
          fileName: uniqueName,
          contentType: file.type,
        },
      })
      // 2) Cloud Storage 이미지 업로드
      const { fileUrl, uploadUrl } = presignedResponse.data
      const res = await fetch(uploadUrl, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!res.ok) throw new Error(`이미지 업로드 실패: ${res.status}`)

      // 3) 최종 공개 URL 조립
      return fileUrl
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err)
        throw err
      }
      const fallbackError: Error = new Error('알 수 없는 에러 발생')
      setError(fallbackError)
      throw fallbackError
    } finally {
      setIsUploading(false)
    }
  }, [])

  return { uploadFile, isUploading, error }
}
