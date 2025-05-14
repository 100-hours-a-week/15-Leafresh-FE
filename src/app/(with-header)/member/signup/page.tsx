'use client'

import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useOAuthUserStore } from '@entities/member/context/OAuthUserStore'
import { OAuthType } from '@entities/member/type'
import { NicknameDuplicate } from '@features/member/api/nickname-duplicate'
import { SignUp, SignUpBody } from '@features/member/api/signup'
import { SignupFormType, signupSchema } from '@features/member/signup/schema'
import ErrorText from '@shared/components/errortext'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { ToastType } from '@shared/context/Toast/type'
import { useToast } from '@shared/hooks/useToast/useToast'

const SignupPage = () => {
  const router = useRouter()
  const { userInfo } = useOAuthUserStore()
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
  })

  const { mutate: SignUpMutate } = useMutation({
    mutationFn: SignUp,
    onSuccess: response => {
      if (response.data.isDuplicated) {
        setError('nickname', {
          type: 'manual',
          message: '이미 존재하는 유저입니다.',
        })
      } else {
        openToast(ToastType.Success, '회원가입이 완료되었습니다.')
        router.replace(URL.MAIN.INDEX.value)
      }
    },
    onError: () => {
      openToast(ToastType.Error, '회원가입 중 오류가 발생했습니다.')
    },
  })

  useEffect(() => {
    if (userInfo?.isMember) {
      // if (!userInfo || userInfo?.isMember) {
      router.replace(URL.MAIN.INDEX.value)
    }
  }, [userInfo])

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

    if (!userInfo) {
      openToast(ToastType.Error, '로그인 정보가 없습니다.')
      return
    }

    const providerId = Number(userInfo.nickname.replace(/^사용자/, ''))

    const body: SignUpBody = {
      email: userInfo.email,
      provider: {
        name: userInfo.provider.toUpperCase() as OAuthType,
        id: providerId,
      },
      nickname: data.nickname,
      imageUrl: userInfo.imageUrl,
    }

    SignUpMutate({ body })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Title>회원가입</Title>

      <FieldWrapper>
        <Label htmlFor='nickname'>닉네임 *</Label>
        <InputRow>
          <Input id='nickname' {...register('nickname')} />
          <CheckButton type='button' onClick={handleCheckDuplicate}>
            중복 확인
          </CheckButton>
        </InputRow>
        <ErrorText message={errors.nickname?.message} />
      </FieldWrapper>

      <SubmitButton type='submit'>회원가입</SubmitButton>
    </Form>
  )
}

export default SignupPage

const Form = styled.form`
  height: 100%;

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

const FieldWrapper = styled.div`
  margin-bottom: 24px;
`

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
`

const InputRow = styled.div`
  display: flex;
  gap: 8px;
`

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const CheckButton = styled.button`
  background-color: #4c8b5d;
  color: white;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
`

const SubmitButton = styled.button`
  background-color: #99c69f;
  color: black;
  font-weight: bold;
  height: 50px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
`

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`
