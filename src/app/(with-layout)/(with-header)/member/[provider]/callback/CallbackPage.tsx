'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { useOAuthUserStore } from '@entities/member/context/OAuthUserStore'
import { LowercaseOAuthType } from '@entities/member/type'
import { LoginCallback } from '@features/member/api/oauth-callback'
import Loading from '@shared/components/loading'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { useToast } from '@shared/hooks/useToast/useToast'

interface CallbackPageProps {
  provider: LowercaseOAuthType
}

const CallbackPage = ({ provider }: CallbackPageProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const openToast = useToast()
  const { setOAuthUserInfo } = useOAuthUserStore()

  const code = searchParams.get('code')

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.AUTH.CALLBACK(provider),
    queryFn: () => LoginCallback(provider, { code: code as string }),
    ...QUERY_OPTIONS.MEMBER.AUTH.CALLBACK,
    enabled: typeof code === 'string' && code.length > 0,
  })

  // useEffect(() => {
  //   if (!data) return
  //   const { isMember, email, imageUrl, nickname } = data.data

  //   setOAuthUserInfo({ isMember, email, imageUrl, nickname, provider })

  //   if (!isMember) {
  //     router.replace(URL.MEMBER.SIGNUP.value)
  //   } else {
  //     /** ✅ 주의 : UserStore 정보를 받아오지 않는 이유는 AT+RT 받기를 성공했으면 언젠가는 데이터를 불러올 수 있기 때문이다! */
  //     openToast(ToastType.Success, '로그인 성공')
  //     router.replace(URL.MAIN.INDEX.value)
  //   }
  // }, [data])

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    )
  }

  if (isError) {
    // openToast(ToastType.Error, `${provider} 로그인 실패\n재시도 해주세요`)

    return <p>로그인 실패</p>
  }

  // 데이터 로드 후 라우팅될 것이므로 빈 상태 반환
  return null
}

export default CallbackPage

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100dvh;

  display: flex;
  align-items: center;
  justify-content: center;
`
