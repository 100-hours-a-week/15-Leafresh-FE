import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
export const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.lfBlack.base};
`
export const RangeWrapper = styled.div<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  background: #fafafa;
  border-radius: ${({ theme }) => theme.radius.xs};
  width: 100%;
  height: 72px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.lfBlack.base};

    transform-origin: center;
    transform: scaleX(${props => (props.isOpen ? 1 : 0)});
    transition: transform 0.2s ease;
  }
`
export const Panel = styled.div`
  flex: 1;
  padding: 12px 16px;
  cursor: pointer;
`
export const PanelLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  margin-bottom: 15px;
`
export const Divider = styled.div`
  width: 0.1px;
  margin: 5px 0;
  background: #d3d3d3;
`
