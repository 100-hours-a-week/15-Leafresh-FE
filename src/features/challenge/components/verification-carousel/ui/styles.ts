import styled from '@emotion/styled'

export const CarouselViewport = styled.div`
  overflow: hidden;
  display: flex;
`

export const CarouselContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 500px;
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
