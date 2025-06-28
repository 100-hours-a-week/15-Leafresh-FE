import styled from '@emotion/styled'

export const Wrapper = styled.div`
  width: 100%;
`

export const CarouselViewport = styled.div`
  overflow: hidden;
  /* width: 100%; */
  display: flex;
  justify-content: center;
`

export const CarouselContainer = styled.div`
  display: flex;
  margin: 0 auto; /* 화면 중앙 정렬 */
`

export const Slide = styled.div`
  flex: 0 0 100%;
  display: flex;
  padding: 8px 0;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
`

export const Dot = styled.button<{ isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ isActive }) => (isActive ? '#2e7d32' : '#ccc')};
  border: none;
  cursor: pointer;
`
