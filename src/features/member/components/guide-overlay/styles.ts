import styled from '@emotion/styled'

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.8);

  &.fade-out {
    animation: fadeOut 0.5s ease forwards;
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(10px);
    }
  }
`

export const SwipeGuide = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 10px;
`

export const DownGuide = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
  padding: 6px 12px;
  border-radius: 20px;
`
