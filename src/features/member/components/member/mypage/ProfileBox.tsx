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

const ProfileBox = ({
  className,
  nickName,
  profileImageUrl,
  level,
  treeImageUrl,
  onClick,
}: ProfileBoxProps): ReactNode => {
  console.log(nickName)
  return (
    <Container>
      <TreeImage src={treeImageUrl} alt='tree level' width={56} height={56} />
      <ProfileImage src={profileImageUrl} alt='profile' width={50} height={50} />
      <ProfileContent>
        <Name>{nickName}</Name>
        <Level>{level}</Level>
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
  justify-content: flex-start;
  align-items: center;
  justify-self: center;

  padding: 10px 0;
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfPrime};
`

const TreeImage = styled(Image)`
  width: 56px;
  height: 56px;
`

const ProfileImage = styled(Image)`
  width: 50px;
  height: 50px;
  object-fit: cover;
`

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const Name = styled.p`
  font-size: ${theme.fontSize.md};
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
