'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'

import { NicknameDuplicate, ProfileResponse, SignUpBody, SignUpResponse, SignUpVariables } from '@/entities/member/api'
import { OAuthType, SignupFormType, signupSchema } from '@/entities/member/model'

import { ErrorText } from '@/shared/components'
import { MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, theme, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { useOAuthUserStore, UserInfo, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'
import { ENDPOINTS, fetchRequest } from '@/shared/lib'

const SignupPage = () => {
  const router = useRouter()
  const { OAuthUserInfo } = useOAuthUserStore()
  const { toast } = useToast()
  const { setUserInfo } = useUserStore()

  const [isDuplicateChecked, setIsDuplicateChecked] = useState<boolean>(false)
  const [lastCheckedNickname, setLastCheckedNickname] = useState<string>('') // 검사된 닉네임 저장

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
  })

  const nickname = watch('nickname')

  const { refetch: CheckNicknameDuplicate, isLoading: isCheckingNickname } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.DUPLICATE_NICKNAME,
    queryFn: () => NicknameDuplicate({ input: nickname }),
    enabled: false,
    ...QUERY_OPTIONS.MEMBER.DUPLICATE_NICKNAME,
  })

  const { mutate: SignUpMutate } = useMutationStore<SignUpResponse, SignUpVariables>(MUTATION_KEYS.MEMBER.SIGNUP)

  useEffect(() => {
    /** 이미 회원가입한 유저일 경우 */
    if (OAuthUserInfo?.isMember) {
      router.replace(URL.MAIN.INDEX.value)
    }
  }, [OAuthUserInfo])

  const handleCheckDuplicate = async () => {
    if (!nickname) {
      setError('nickname', {
        type: 'manual',
        message: '닉네임을 입력해주세요.',
      })
      return
    }

    try {
      const { data } = await CheckNicknameDuplicate()

      if (data?.data.isDuplicated) {
        setIsDuplicateChecked(false)
        setLastCheckedNickname('')
        setError('nickname', {
          type: 'manual',
          message: '이미 사용 중인 닉네임입니다.',
        })
      } else {
        toast('Success', '중복 검사 성공')
        setIsDuplicateChecked(true)
        setLastCheckedNickname(nickname)
        clearErrors('nickname')
      }
    } catch (error) {
      toast('Error', '중복 확인 중 오류가 발생했습니다.')
    }
  }

  const onSubmit = async (data: SignupFormType) => {
    if (!isDuplicateChecked || nickname !== lastCheckedNickname) {
      setError('nickname', {
        type: 'manual',
        message: '닉네임 중복 검사를 해주세요.',
      })
      return
    }

    if (!OAuthUserInfo) {
      toast('Error', '로그인 정보가 없습니다.')
      return
    }

    const providerId = Number(OAuthUserInfo.nickname.replace(/^사용자/, ''))

    const body: SignUpBody = {
      email: OAuthUserInfo.email,
      provider: {
        name: OAuthUserInfo.provider.toUpperCase() as OAuthType,
        id: providerId,
      },
      nickname: data.nickname,
      imageUrl: OAuthUserInfo.imageUrl,
    }

    SignUpMutate(
      { body },
      {
        onSuccess: () => {
          // ✅ 로그인 성공 → 유저 정보 요청 → 전역 상태에 저장
          ;(async () => {
            try {
              const { data: profileData } = await fetchRequest<ProfileResponse>(ENDPOINTS.MEMBERS.DETAILS)
              if (profileData) {
                const { nickname, email, profileImageUrl, treeImageUrl, treeLevelId, treeLevelName } = profileData

                const userInfo: UserInfo = {
                  nickname,
                  email,
                  imageUrl: profileImageUrl,
                  treeState: {
                    level: treeLevelId,
                    name: treeLevelName,
                    imageUrl: treeImageUrl,
                  },
                }

                setUserInfo(userInfo)
              }
            } catch (err) {
              console.warn('유저 정보 가져오기 실패', err)
            }
          })()

          router.replace(URL.MAIN.INDEX.value) // 회원가입 후 메인으로 이동
        },
      },
    )
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Title>회원가입</Title>

      <FieldWrapper>
        <InputWrapper>
          <Label htmlFor='nickname'>닉네임 *</Label>
          <Input id='nickname' {...register('nickname')} />
        </InputWrapper>
        <CheckButton type='button' onClick={handleCheckDuplicate}>
          중복 확인
        </CheckButton>
        <ErrorText message={errors.nickname?.message} />
      </FieldWrapper>

      <SubmitButton type='submit'>회원가입</SubmitButton>
    </Form>
  )
}

export default SignupPage

const Form = styled.form`
  height: 100%;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 24px;
`

const Title = styled.h2`
  margin-bottom: 32px;
  font-size: 20px;
  font-weight: bold;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const FieldWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 5px;

  margin-bottom: 24px;
`

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
`

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const CheckButton = styled.button`
  background-color: #4c8b5d;
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.lfWhite.base};

  margin-top: 6px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;

  cursor: pointer;
`

const SubmitButton = styled.button`
  background-color: ${theme.colors.lfGreenInactive.base};
  color: ${theme.colors.lfBlack.base};
  font-weight: bold;
  height: 50px;
  border: none;
  border-radius: ${theme.radius.sm};
  font-size: 16px;
  cursor: pointer;
`

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`
