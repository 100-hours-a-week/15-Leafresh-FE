import { toastStore } from '@/shared/context'

/**
 * 클립보드에 문자열을 복사하고, 공통 토스트 메시지를 출력합니다.
 * @param text 복사할 텍스트
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  const openToast = toastStore.getState().toast

  try {
    await navigator.clipboard.writeText(text)
    openToast('Success', '링크가 복사되었습니다!')
  } catch {
    openToast('Error', '복사에 실패했습니다. 다시 시도해주세요.')
  }
}
