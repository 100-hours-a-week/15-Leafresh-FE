import { ReactNode } from 'react'

import styled from '@emotion/styled'
import Image from 'next/image'
import { theme } from '@shared/styles/theme'

interface ProfileBoxProps {
  className?: string
  nickName: string
  profileImageUrl: string
  level: number
  treeImageUrl: string
  onClick?: () => void
}

export const treeLevelMap: Record<number, string> = {
  1: '새싹',
  2: '묘목',
  3: '관목',
  4: '중교목',
  5: '거목',
}

const ProfileBox = ({
  className,
  nickName,
  profileImageUrl,
  level,
  treeImageUrl,
  onClick,
}: ProfileBoxProps): ReactNode => {
  return (
    <Container>
      <ProfileImage src={profileImageUrl} alt='profile' width={50} height={50} />
      <ProfileContent>
        <Name>{nickName}</Name>
        <LevelWrapper>
          <TreeImage src={treeImageUrl} alt='tree level' width={32} height={32} />
          <Level>{treeLevelMap[level] ?? `${level}`} 단계</Level>
        </LevelWrapper>
      </ProfileContent>
      <CardButton onClick={onClick}>자세히</CardButton>
    </Container>
  )
}

export default ProfileBox

const Container = styled.div`
  width: 322px;
  display: flex;
  flex-direction: row;
  background-color: #eff9e8;
  /* align-self: center; */
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  justify-self: center;

  padding: 5px 10px;
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfPrime};
`

const TreeImage = styled(Image)`
  width: 32px;
  height: 32px;
`

const ProfileImage = styled(Image)`
  width: 50px;
  height: 50px;
  /* flex: 1; */
  object-fit: cover;

  border-radius: ${theme.radius.full};
`

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  /* gap: 5px; */
`

const Name = styled.p`
  font-size: ${theme.fontSize.md};

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  max-width: 180px;
`

const LevelWrapper = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`
const Level = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`

const CardButton = styled.button`
  width: 60px;
  height: 40px;
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};

  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.lfGreenMain.hover};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`
