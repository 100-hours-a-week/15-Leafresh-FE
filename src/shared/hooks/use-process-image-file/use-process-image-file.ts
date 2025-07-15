export const useProcessImageFile = () => {
  const processImageFile = async (file: File, filename = 'image.jpg'): Promise<File | null> => {
    try {
      const imageBitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      canvas.width = imageBitmap.width
      canvas.height = imageBitmap.height

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context 생성 실패')

      ctx.drawImage(imageBitmap, 0, 0)

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (!blob) return reject(new Error('Blob 생성 실패'))

          const processedFile = new File([blob], filename, {
            type: 'image/jpeg',
          })

          resolve(processedFile)
        }, 'image/jpeg')
      })
    } catch (error) {
      return null
    }
  }

  return { processImageFile }
}
