'use client'

import { ReactNode, useEffect } from 'react'

import { z } from 'zod'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'

import { getMemberProfile, MemberInfoRequest, MemberInfoResponse, ProfileResponse } from '@/entities/member/api'

import { Loading, LucideIcon } from '@/shared/components'
import { MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, useMutationStore } from '@/shared/config'
import { useUserStore } from '@/shared/context'
import { useUploadImageToBucket, useToast, useProcessImageFile } from '@/shared/hooks'

import * as S from './styles'

interface ProfileModifyPageProps {
  className?: string
}

const profileSchema = z.object({
  nickname: z.string().max(20, '닉네임은 최대 20자까지 입력 가능합니다.').optional(),
  imageUrl: z.string().url().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

const maxLength = 20

export const ProfileModifyPage = ({ className }: ProfileModifyPageProps): ReactNode => {
  const { toast } = useToast()

  // const [imageUrl, setImageUrl] = useState('')

  const { processImageFile } = useProcessImageFile()
  const { uploadFile, loading: uploading } = useUploadImageToBucket()

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const processed = await processImageFile(file, 'thumbnail.jpg')
    if (!processed) {
      toast('Error', '이미지 처리에 실패했습니다')
      return
    }

    try {
      const uploadedUrl = await uploadFile(processed)
      setValue('imageUrl', uploadedUrl)
      toast('Success', '프로필 이미지 업로드 성공')
    } catch {
      toast('Error', '프로필 이미지 업로드 실패')
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
      toast('Error', '변경된 정보가 없습니다')
      return
    }

    patchMemberInfo(body, {
      onSuccess: res => {
        updateUserInfo({
          nickname: res.data.nickname,
          imageUrl: res.data.imageUrl,
        })
        toast('Success', '프로필 수정 성공')
      },
      onError: err => {
        toast('Error', err.message || '프로필 수정에 실패했습니다.\n다시 시도해 주세요!')
      },
    })
  }

  if (!profileData) return <Loading />

  const profile: ProfileResponse = profileData.data ?? ({} as ProfileResponse)

  const profileImage = watch('imageUrl') || profile?.profileImageUrl
  const watchedNickname = watch('nickname') ?? ''
  const watchedImageUrl = watch('imageUrl') ?? ''

  const isUnchanged: boolean =
    watchedNickname === (profile?.nickname ?? '') && watchedImageUrl === (profile?.profileImageUrl ?? '')

  return (
    <S.Container className={className}>
      <S.Header>
        <S.Title>프로필 수정</S.Title>
      </S.Header>

      <S.ProfileWrapper>
        <S.UploadImageButton htmlFor='profile-image' $hasImage={!!profileImage}>
          {profileImage && <S.ProfileImage src={profileImage} alt='프로필 이미지' />}
          <S.CameraWrapper>
            <LucideIcon size={14} name='Pencil' color='lfBlack' />
            수정
          </S.CameraWrapper>
          <S.HiddenInput
            id='profile-image'
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            disabled={uploading}
          />
        </S.UploadImageButton>
      </S.ProfileWrapper>

      <S.InputSection>
        <S.InputWrapper>
          <S.Label>이메일</S.Label>
          <S.TextInput type='text' defaultValue={profile?.email} readOnly $readonly />
        </S.InputWrapper>

        <S.InputWrapper>
          <S.Label>닉네임</S.Label>
          <S.TextInput type='text' {...register('nickname')} placeholder={profile?.nickname || '나의 닉네임'} />
          <S.InputMeta hasError={!!errors.nickname}>
            <S.StyledErrorText message={errors.nickname?.message} />
            <S.CountText hasError={!!errors.nickname}>
              {watch('nickname')?.length || 0}/{maxLength}
            </S.CountText>
          </S.InputMeta>
        </S.InputWrapper>
      </S.InputSection>

      <S.SubmitButton onClick={handleSubmit(onSubmit)} disabled={isUnchanged || uploading}>
        {uploading ? '업로드 중...' : '수정하기'}
      </S.SubmitButton>
    </S.Container>
  )
}
