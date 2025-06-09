// shared/components/auth/AuthGuard.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

import { UserInfo, useUserStore } from '@entities/member/context/UserStore'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { URL } from '@shared/constants/route/route'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/useToast/useToast'
import { fetchRequest } from '@shared/lib/api'

/** 보호가 필요한 경로 목록 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractProtectedRoutes(obj: any): string[] {
  const result: string[] = []

  for (const key in obj) {
    const entry = obj[key]
    if (typeof entry === 'object' && entry !== null) {
      if (typeof entry.value === 'string' && entry.isProtected) {
        result.push(entry.value)
      } else {
        result.push(...extractProtectedRoutes(entry))
      }
    }
  }

  return result
}

const PROTECTED_ROUTES = extractProtectedRoutes(URL)

interface Props {
  children: React.ReactNode
}

type UserInfoResponse = {
  nickname: string
  profileImageUrl: string
  treeLevelId: number
  treeLevelName: string
  treeImageUrl: string
}

const AuthGuard = ({ children }: Props) => {
  const pathname = usePathname()
  const router = useRouter()
  const openToast = useToast()

  const { userInfo, setUserInfo, clearUserInfo } = useUserStore()
  const [isVerified, setIsVerified] = useState(false)

  // 보호 경로인지 판별
  const isProtectedRoute = PROTECTED_ROUTES.some(prefix => pathname.startsWith(prefix))

  useEffect(() => {
    if (!isProtectedRoute) {
      // 보호 경로가 아니면 검사 안 하고 바로 통과
      setIsVerified(true)
      return
    }

    const validate = async () => {
      try {
        const { data } = await fetchRequest<UserInfoResponse>(ENDPOINTS.MEMBERS.DETAILS)
        const { nickname, profileImageUrl, treeImageUrl, treeLevelId, treeLevelName } = data
        const userInfo: UserInfo = {
          nickname,
          imageUrl: profileImageUrl,
          treeState: {
            level: treeLevelId,
            name: treeLevelName,
            imageUrl: treeImageUrl,
          },
        }
        setUserInfo(userInfo)
        setIsVerified(true)
      } catch (e) {
        clearUserInfo()
        openToast(ToastType.Error, '로그인이 필요합니다')
        router.replace(URL.MEMBER.LOGIN.value)
      }
    }

    validate()
  }, [pathname, isProtectedRoute])

  if (!isVerified) return null

  return <>{children}</>
}

export default AuthGuard
