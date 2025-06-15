'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { use, useEffect } from 'react'

import { LoginCallback } from '@entities/member/api/callback-oauth'
import { useOAuthUserStore } from '@entities/member/model/oauth-user-store'
import { LowercaseOAuthType } from '@entities/member/type'
import Loading from '@shared/components/loading/ui/loading'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/useToast/useToast'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

const CallbackPage = ({ params }: { params: Promise<{ provider: LowercaseOAuthType }> }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { provider } = use(params)
  const openToast = useToast()
  const { setOAuthUserInfo } = useOAuthUserStore()

  const code = searchParams.get('code')

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.AUTH.CALLBACK(provider),
    queryFn: () => LoginCallback(provider, { code: code! }),
    enabled: !!code,
    ...QUERY_OPTIONS.MEMBER.AUTH.CALLBACK,
  })

  useEffect(() => {
    if (!data) return

    const { isMember, email, imageUrl, nickname } = data.data

    setOAuthUserInfo({ isMember, email, imageUrl, nickname, provider })

    if (!isMember) {
      router.replace(URL.MEMBER.SIGNUP.value)
    } else {
      /** ✅ 주의 : UserStore 정보를 받아오지 않는 이유는 AT+RT 받기를 성공했으면 언젠가는 데이터를 불러올 수 있기 때문이다! */
      openToast(ToastType.Success, '로그인 성공')
      router.replace(URL.MAIN.INDEX.value)
    }
  }, [data, router, openToast, setOAuthUserInfo])

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    )
  }

  if (isError) {
    openToast(ToastType.Error, `${provider} 로그인 실패\n재시도 해주세요`)

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
