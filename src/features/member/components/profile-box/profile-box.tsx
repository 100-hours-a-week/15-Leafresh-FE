'use client'

import { ReactNode } from 'react'

import { treeLevelMap } from '@/entities/member/model'

import * as S from './styles'

interface ProfileBoxProps {
  className?: string
  nickName: string
  profileImageUrl: string
  level: number
  treeImageUrl: string
  onClick?: () => void
}

export const ProfileBox = ({
  className,
  nickName,
  profileImageUrl,
  level,
  treeImageUrl,
  onClick,
}: ProfileBoxProps): ReactNode => {
  return (
    <S.Container>
      <S.ProfileImage src={profileImageUrl} alt='profile' width={50} height={50} />
      <S.ProfileContent>
        <S.Name>{nickName}</S.Name>
        <S.LevelWrapper>
          <S.TreeImage src={treeImageUrl} alt='tree level' width={32} height={32} />
          <S.Level>{treeLevelMap[level] ?? `${level}`} 단계</S.Level>
        </S.LevelWrapper>
      </S.ProfileContent>
      <S.CardButton onClick={onClick}>자세히</S.CardButton>
    </S.Container>
  )
}
