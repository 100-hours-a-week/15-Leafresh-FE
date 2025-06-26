import styled from '@emotion/styled'

export const SlideContainer = styled.div<{ isDragging: boolean }>`
  display: flex;
  scroll-behavior: smooth;
  gap: 5px;
  user-select: none;

  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`

export const SlideItem = styled.div`
  flex: 0 0 auto;
  width: auto;
  min-width: min-content;
  transition:
    opacity 1s ease,
    transform 1s ease;
  scroll-snap-align: start;
`
