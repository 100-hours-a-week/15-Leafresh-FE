'use client'

import { ReactNode, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { Camera } from 'lucide-react'
import { z } from 'zod'

import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'

import { useOAuthUserStore } from '@entities/member/context/OAuthUserStore'
import { MemberInfoRequest, MemberInfoResponse, PatchMemberInfo } from '@features/member/api/profile/patch-member-info'

import { useImageUpload } from '@shared/hooks/useImageUpload/useImageUpload'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/useToast/useToast'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { useRouter } from 'next/navigation'
import { URL } from '@shared/constants/route/route'
import { theme } from '@shared/styles/theme'
import { taintObjectReference } from 'next/dist/server/app-render/entry-base'

interface ProfileModifyPageProps {
  className?: string
}

const nicknameSchema = z
  .string()
  .min(1, '닉네임을 입력해주세요.')
  .max(20, '닉네임은 최대 20자까지 입력 가능합니다.')
  .optional()

const maxLength = 20

const ProfileModifyPage = ({ className }: ProfileModifyPageProps): ReactNode => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const openToast = useToast()

  const { userInfo, updateUserInfo } = useOAuthUserStore()
  const [nickname, setNickname] = useState('')
  const [nicknameError, setNicknameError] = useState<string | undefined>(undefined)
  const [imageUrl, setImageUrl] = useState('')
  const { uploadFile, loading: uploading } = useImageUpload()

  const profile = queryClient.getQueryData<any>(QUERY_KEYS.MEMBER.DETAILS)?.data

  const { mutate: patchMemberInfo } = useMutationStore<MemberInfoResponse, MemberInfoRequest>(
    MUTATION_KEYS.MEMBER.MODIFY,
  )

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNickname(value)
    try {
      nicknameSchema.parse(value)
      setNicknameError('')
    } catch (err) {
      if (err instanceof z.ZodError) {
        setNicknameError(err.errors[0].message)
      }
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0]
    if (!originalFile) return

    try {
      const imageBitmap = await createImageBitmap(originalFile)
      const canvas = document.createElement('canvas')
      canvas.width = imageBitmap.width
      canvas.height = imageBitmap.height

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context 생성 실패')

      ctx.drawImage(imageBitmap, 0, 0)

      canvas.toBlob(async blob => {
        if (!blob) return

        const uuid = crypto.randomUUID()
        const timestamp = Date.now()
        const file = new File([blob], `profile_${uuid}_${timestamp}.jpg`, {
          type: 'image/jpeg',
        })

        const uploadedUrl = await uploadFile(file)
        setImageUrl(uploadedUrl)
        openToast(ToastType.Success, '이미지가 성공적으로 업로드되었습니다.')
      }, 'image/jpeg')
    } catch (err) {
      openToast(ToastType.Error, '이미지 업로드에 실패했습니다.')
    }
  }

  const handleSubmit = async () => {
    // 유효성 검사
    try {
      if (nickname) nicknameSchema.parse(nickname)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setNicknameError(err.errors[0].message)
      }
      return
    }

    const body: MemberInfoRequest = {}

    if (nickname && nickname !== profile?.nickname) body.nickname = nickname
    if (imageUrl && imageUrl !== profile?.imageUrl) body.imageUrl = imageUrl

    if (Object.keys(body).length === 0) {
      openToast(ToastType.Error, '변경된 정보가 없습니다.')
      return
    }

    patchMemberInfo(body, {
      onSuccess: res => {
        updateUserInfo(res.data)
        openToast(ToastType.Success, '프로필이 성공적으로 수정되었습니다.')
        setTimeout(() => {
          router.push(URL.MEMBER.PROFILE.MYPAGE.value)
        }, 1500)
      },
      onError: err => {
        openToast(ToastType.Error, err.message || '프로필 수정에 실패했습니다.')
      },
    })
  }

  const currentImage = profile?.profileImageUrl
  const currentNickname = nickname

  return (
    <Container className={className}>
      <Header>
        <Title>프로필 수정</Title>
      </Header>

      <ProfileWrapper>
        <UploadImageButton htmlFor='profile-image' $hasImage={!!currentImage}>
          {currentImage && <ProfileImage src={currentImage} alt='프로필 이미지' />}
          {/* {!currentImage && <PlaceholderIcon />} */}
          <CameraWrapper>
            <CameraIcon />
          </CameraWrapper>
          <HiddenInput
            id='profile-image'
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            disabled={uploading}
          />
        </UploadImageButton>
      </ProfileWrapper>

      <InputSection>
        <Label>닉네임</Label>
        <TextInput
          type='text'
          value={currentNickname}
          onChange={handleNicknameChange}
          placeholder={profile?.nickname || userInfo?.nickname || '나의 닉네임'}
        />
        <InputMeta>
          <ErrorText>{nicknameError}</ErrorText>
          <CountText>
            {currentNickname.length}/{maxLength}
          </CountText>
        </InputMeta>
      </InputSection>

      <SubmitWrapper>
        <SubmitButton onClick={handleSubmit} disabled={currentNickname.length === 0 || !!nicknameError || uploading}>
          {uploading ? '업로드 중...' : '완료'}
        </SubmitButton>
      </SubmitWrapper>
    </Container>
  )
}

export default ProfileModifyPage

const Container = styled.div`
  max-width: 24rem;
  margin: 0 auto;
  background-color: #fff;
  min-height: 100vh;
`

const Header = styled.div`
  /* text-align: center; */
  padding: 10px 0;
  border-bottom: 1px solid ${theme.colors.lfLightGray.base};
`

const Title = styled.h1`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: #111827;
`

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
`

const UploadImageButton = styled.label<{ $hasImage: boolean }>`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: ${({ $hasImage }) => ($hasImage ? 'transparent' : '#e5e7eb')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #d1d5db;
`

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`

// const PlaceholderIcon = styled.div`
//   width: 2rem;
//   height: 2rem;
//   background-color: #d1d5db;
//   border-radius: 4px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

const CameraWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`

const CameraIcon = styled(Camera)`
  width: 30px;
  height: 30px;
  color: ${theme.colors.lfBlack.base};
`

const HiddenInput = styled.input`
  display: none;
`

const InputSection = styled.div`
  padding: 0 1.5rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.5rem;
`

const TextInput = styled.input`
  width: 100%;
  padding: 0.5rem 0;
  background: transparent;
  border: 0;
  border-bottom: 1px solid #d1d5db;
  color: #111827;
  font-size: 1rem;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    outline: none;
    border-color: #6b7280;
  }
`

const InputMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
  font-size: 0.875rem;
`

const ErrorText = styled.span`
  color: #ef4444;
`

const CountText = styled.span`
  color: #9ca3af;
`

const SubmitWrapper = styled.div`
  display: flex;
  padding: 1rem 1.5rem;
`

const SubmitButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 1rem;
  background-color: ${({ disabled }) => (disabled ? '#9ca3af' : '#000')};
  color: white;
  text-align: center;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #1f2937;
  }
`
