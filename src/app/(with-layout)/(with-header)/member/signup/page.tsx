'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { NicknameDuplicate } from '@entities/member/api/check-nickname-duplicate'
import { SignUpBody, SignUpResponse, SignUpVariables } from '@entities/member/api/register'
import { useOAuthUserStore } from '@entities/member/model/oauth-user-store'
import { OAuthType } from '@entities/member/type'
import { SignupFormType, signupSchema } from '@features/member/signup/schema'
import ErrorText from '@shared/components/errortext/ui/error-text'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/useToast/useToast'
import { theme } from '@shared/styles/theme'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'

const SignupPage = () => {
  const router = useRouter()
  const { OAuthUserInfo } = useOAuthUserStore()
  const openToast = useToast()

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
        openToast(ToastType.Success, '중복 검사 성공')
        setIsDuplicateChecked(true)
        setLastCheckedNickname(nickname)
        clearErrors('nickname')
      }
    } catch (error) {
      openToast(ToastType.Error, '중복 확인 중 오류가 발생했습니다.')
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
      openToast(ToastType.Error, '로그인 정보가 없습니다.')
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
          /** ✅ 주의 : UserStore 정보를 받아오지 않는 이유는 AT+RT 받기를 성공했으면 언젠가는 데이터를 불러올 수 있기 때문이다! */
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
