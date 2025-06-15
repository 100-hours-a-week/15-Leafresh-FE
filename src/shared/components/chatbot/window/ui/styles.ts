import styled from '@emotion/styled'

// 채팅 윈도우 컨테이너
export const Window = styled.div<{ open: boolean; animationComplete: boolean }>`
  position: fixed;
  max-width: 385px;
  width: 90%;
  height: 95%;
  top: 50%;
  left: 50%;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100000;

  /* 애니메이션 적용 */
  transform: translate(-50%, ${({ open }) => (open ? '-50%' : '100%')});
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transition:
    transform 1.2s cubic-bezier(0.19, 1, 0.22, 1),
    opacity 1s,
    visibility 1s;

  display: flex;
  flex-direction: column;
`

// 채팅 본문 영역
export const Body = styled.div`
  flex: 1;
  background: #f5fff2;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`
