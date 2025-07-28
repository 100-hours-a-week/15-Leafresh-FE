import Image from 'next/image'

import styled from '@emotion/styled'

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  @media (max-width: 1150px) {
    display: none;
  }
`
export const ItemWrapper = styled.div`
  margin-top: 28px;
  padding-bottom: 16px;

  display: flex;
  justify-content: center;
  gap: 40px;

  border-bottom: 1px solid #03452e;
`

export const DataWrapper = styled.div`
  grid-row: span 2;
  place-self: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;

  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`
export const Count = styled.div`
  text-align: center;
  font-size: 36px;
`
export const VerificationCount = styled(Count)`
  min-width: 3ch;
`
export const LeafCount = styled(Count)`
  min-width: 7ch;
`

export const Text = styled.p`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const StyledImage = styled(Image)`
  width: 100px;
  height: 100px;
  object-fit: contain;
  grid-row: span 2; // ← 여기서 이미지가 두 줄 차지
`

export const IntroduceText = styled.span`
  margin-top: 23px;
  font-size: 28px;
  color: #2a5237;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
