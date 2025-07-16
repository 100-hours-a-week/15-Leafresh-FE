import Image from 'next/image'

import styled from '@emotion/styled'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: #eff9e8;
  /* align-self: center; */
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  justify-self: center;

  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
`

export const TreeImage = styled(Image)`
  width: 32px;
  height: 32px;
`

export const ProfileImage = styled(Image)`
  width: 50px;
  height: 50px;
  /* flex: 1; */
  object-fit: cover;

  border-radius: ${({ theme }) => theme.radius.full};
`

export const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`

export const Name = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  /* flex: 1; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  flex-grow: 1;
  min-width: 0; /* 말줄임 처리를 위해 꼭 필요 */
`

export const LevelWrapper = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`
export const Level = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`

export const CardButton = styled.button`
  width: 60px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfGreenMain.hover};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`
