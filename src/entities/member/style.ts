import { keyframes } from '@emotion/react'

export const slideRotateIn = keyframes`
  0% {
    transform: translateX(-50%) translateY(200px) rotateY(0deg); /* 뷰포트 아래쪽에서 시작 */
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) translateY(-50%) rotateY(360deg); /* 화면 중앙 + 360도 회전 */
    opacity: 1;
  }
`
