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
  display: grid;
  grid-template-columns: 100px 120px 100px 120px; // 4열 구성
  place-items: center;

  gap: 15px;

  border-bottom: 1px solid #03452e;

  align-items: center;
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
  font-size: 36px;
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
