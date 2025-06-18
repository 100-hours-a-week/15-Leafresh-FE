'use client'

import { useRouter } from 'next/navigation'
import { z } from 'zod'

import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'

import { useUserStore } from '@entities/member/context/UserStore'
import { getMemberProfile, ProfileResponse } from '@features/member/api/profile/get-member-profile'
import { MemberInfoRequest, MemberInfoResponse } from '@features/member/api/profile/patch-member-info'
import ErrorText from '@shared/components/errortext/ui/error-text'
import Loading from '@shared/components/loading/ui/loading'
import LucideIcon from '@shared/components/lucide-icon/ui/lucide-icon'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { ToastType } from '@shared/context/toast/type'
import { useImageUpload } from '@shared/hooks/useImageUpload/useImageUpload'
import { useToast } from '@shared/hooks/useToast/useToast'
import { theme } from '@shared/styles/theme'

interface ProfileModifyPageProps {
  className?: string
}

const profileSchema = z.object({
  nickname: z.string().max(20, '닉네임은 최대 20자까지 입력 가능합니다.').optional(),
  imageUrl: z.string().url().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

const maxLength = 20

const ProfileModifyPage = ({ className }: ProfileModifyPageProps): ReactNode => {
  const router = useRouter()
  const openToast = useToast()

  const [nickname, setNickname] = useState('')
  const [nicknameError, setNicknameError] = useState<string | undefined>(undefined)
  const [imageUrl, setImageUrl] = useState('')
  const { uploadFile, loading: uploading } = useImageUpload()

  const { updateUserInfo } = useUserStore()

  const { data: profileData } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.DETAILS,
    queryFn: getMemberProfile,
    ...QUERY_OPTIONS.MEMBER.DETAILS,
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: '', // 초기에는 빈값
      imageUrl: '',
    },
  })

  // profileData가 들어온 이후 초기화
  useEffect(() => {
    if (profileData?.data) {
      reset({
        nickname: profileData.data.nickname ?? '',
        imageUrl: profileData.data.profileImageUrl ?? '',
      })
    }
  }, [profileData, reset])

  const { mutate: patchMemberInfo } = useMutationStore<MemberInfoResponse, MemberInfoRequest>(
    MUTATION_KEYS.MEMBER.MODIFY,
  )

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNickname(value)
    try {
      profileSchema.parse(value)
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
        const file = new File([blob], `profile.jpg`, {
          type: 'image/jpeg',
        })

        const uploadedUrl = await uploadFile(file)
        setValue('imageUrl', uploadedUrl)
        openToast(ToastType.Success, '이미지가 성공적으로 업로드되었습니다')
      }, 'image/jpeg')
    } catch (err) {
      openToast(ToastType.Error, '이미지 업로드에 실패했습니다')
    }
  }

  const onSubmit = (data: ProfileForm) => {
    const body: MemberInfoRequest = {}

    if (data.nickname && data.nickname !== profile?.nickname) {
      body.nickname = data.nickname
    }
    if (data.imageUrl && data.imageUrl !== profile?.profileImageUrl) {
      body.imageUrl = data.imageUrl
    }

    if (Object.keys(body).length === 0) {
      openToast(ToastType.Error, '변경된 정보가 없습니다')
      return
    }

    patchMemberInfo(body, {
      onSuccess: res => {
        updateUserInfo({
          nickname: res.data.nickname,
          imageUrl: res.data.imageUrl,
        })
        router.push(URL.MEMBER.PROFILE.MYPAGE.value)
      },
      onError: err => {
        openToast(ToastType.Error, err.message || '프로필 수정에 실패했습니다.\n다시 시도해 주세요!')
      },
    })
  }

  if (!profileData) return <Loading />

  const profile: ProfileResponse = profileData.data ?? ({} as ProfileResponse)

  const currentImage = watch('imageUrl') || profile?.profileImageUrl

  //이미지 업로드 시 변경
  const backgroundImage = imageUrl || currentImage

  const watchedNickname = watch('nickname') ?? ''
  const watchedImageUrl = watch('imageUrl') ?? ''

  const isUnchanged =
    watchedNickname === (profile?.nickname ?? '') && watchedImageUrl === (profile?.profileImageUrl ?? '')

  return (
    <Container className={className}>
      <Header>
        <Title>프로필 수정</Title>
      </Header>

      <ProfileWrapper>
        <UploadImageButton htmlFor='profile-image' $hasImage={!!currentImage}>
          {currentImage && <ProfileImage src={backgroundImage} alt='프로필 이미지' />}
          <CameraWrapper>
            <LucideIcon size={14} name='Pencil' color='lfBlack' />
            수정
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
        <InputWrapper>
          <Label>이메일</Label>
          <TextInput type='text' defaultValue={profile?.email} readOnly $readonly />
        </InputWrapper>

        <InputWrapper>
          <Label>닉네임</Label>
          <TextInput type='text' {...register('nickname')} placeholder={profile?.nickname || '나의 닉네임'} />
          <InputMeta hasError={!!errors.nickname}>
            <StyledErrorText message={errors.nickname?.message} />
            <CountText hasError={!!errors.nickname}>
              {watch('nickname')?.length || 0}/{maxLength}
            </CountText>
          </InputMeta>
        </InputWrapper>
      </InputSection>

      <SubmitButton onClick={handleSubmit(onSubmit)} disabled={isUnchanged || uploading}>
        {uploading ? '업로드 중...' : '수정하기'}
      </SubmitButton>
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
  background-color: ${({ $hasImage }) => ($hasImage ? 'transparent' : '#fff')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fcfcfc;
`

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`

const CameraWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 0px;
  gap: 3px;
  padding: 5px 5px;

  background-color: ${theme.colors.lfWhite.base};
  color: ${theme.colors.lfBlack.base};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semiBold};
  border: 1px solid #3d444d;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`

const HiddenInput = styled.input`
  display: none;
`
const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.5rem;
`

const TextInput = styled.input<{ $readonly?: boolean }>`
  width: 100%;
  padding: 0.5rem 0;
  background: transparent;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lfLightGray.base};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  font-size: 1rem;
  &::placeholder {
    color: ${({ theme }) => theme.colors.lfGray.base};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.lfGray.base};
  }

  ${({ $readonly, theme }) =>
    $readonly &&
    `
    color: ${theme.colors.lfGray.base};
    cursor: not-allowed;
    background-color: transparent;
  `}
`
const InputMeta = styled.div<{ hasError: boolean }>`
  display: flex;

  justify-content: ${({ hasError }) => (hasError ? 'space-between' : 'flex-end')};
  align-items: center;
  margin-top: 0.25rem;
  font-size: 0.875rem;
`

const CountText = styled.span<{ hasError: boolean }>`
  color: ${({ hasError }) => (hasError ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};
  font-size: ${theme.fontSize.sm};
`

const SubmitButton = styled.button<{ disabled: boolean }>`
  margin-top: 20px;
  width: 100%;
  padding: 10px 0;
  background-color: ${({ disabled }) =>
    disabled ? `${theme.colors.lfGreenInactive.base}` : `${theme.colors.lfGreenMain.base}`};
  color: ${theme.colors.lfWhite.base};
  text-align: center;
  font-weight: ${theme.fontWeight.medium};
  border-radius: ${theme.radius.sm};
  box-shadow: ${theme.shadow.lfPrime};
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  :hover:not(:disabled) {
    background-color: ${theme.colors.lfGreenMain.hover};
  }
`

const StyledErrorText = styled(ErrorText)`
  margin: 0;
`
