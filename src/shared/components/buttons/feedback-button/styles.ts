import styled from '@emotion/styled'

export const LinkWrapper = styled.a`
  position: fixed;
  right: 30px;
  bottom: 30px;

  @media (max-width: 735px) {
    display: none;
  }

  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);

  &:hover {
    transform: scale(1.2);
  }
`
