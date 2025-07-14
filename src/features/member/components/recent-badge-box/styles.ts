import Image from 'next/image'

import styled from '@emotion/styled'

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-self: center;
  justify-self: center;
  flex-direction: column;

  width: 100%;
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
  overflow: hidden;

  /* padding: 15px; */
  border-radius: ${({ theme }) => theme.radius.base};
`

export const TitleWrapper = styled.div`
  height: 45px;
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  display: flex;
  align-items: center;
`
export const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  padding: 0 0 0 20px;
  margin: 0;
`

export const BadgeWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 390px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const BadgeCard = styled.div`
  padding: 10px;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`

export const BadgeImage = styled(Image)`
  width: auto;
  width: 48px;
  height: 48px;
  object-fit: cover;
`
export const BadgeName = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
`

export const NoContentWrapper = styled.div`
  height: 80px;

  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};

  display: flex;
  justify-content: center;
  align-items: center;
`
