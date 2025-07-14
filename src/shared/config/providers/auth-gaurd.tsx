'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { ProfileResponse } from '@/entities/member/api'

import { URL } from '@/shared/constants'
import { UserInfo, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'
import { ENDPOINTS, fetchRequest } from '@/shared/lib'

/** 보호가 필요한 경로 목록 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractProtectedRoutes(obj: any): string[] {
  const result: string[] = []

  for (const key in obj) {
    const entry = obj[key]
    if (typeof entry === 'object' && entry !== null) {
      if (entry.isProtected) {
        if (typeof entry.value === 'string') {
          result.push(entry.value)
        } else if (typeof entry.dynamicPath === 'string') {
          result.push(entry.dynamicPath)
        }
      }
      result.push(...extractProtectedRoutes(entry))
    }
  }

  return result
}

const PROTECTED_ROUTES = extractProtectedRoutes(URL).map(path =>
  path.includes('[') ? path.replace(/\[.*?\]/g, '[^/]+') : path,
)

interface Props {
  children: React.ReactNode
}

export const AuthGuard = ({ children }: Props) => {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const { userInfo, setUserInfo, clearUserInfo } = useUserStore()
  const [isVerified, setIsVerified] = useState(false)

  // 보호 경로인지 판별
  const isProtectedRoute = PROTECTED_ROUTES.some(pattern => {
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(pathname)
  })

  useEffect(() => {
    if (!isProtectedRoute) {
      // 보호 경로가 아니면 검사 안 하고 바로 통과
      setIsVerified(true)
      return
    }

    const validate = async () => {
      try {
        const { data } = await fetchRequest<ProfileResponse>(ENDPOINTS.MEMBERS.DETAILS)
        const { nickname, email, profileImageUrl, treeImageUrl, treeLevelId, treeLevelName } = data
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
        setIsVerified(true)
      } catch (e) {
        clearUserInfo()
        toast('Error', '로그인이 필요합니다')
        router.replace(URL.MEMBER.LOGIN.value)
      }
    }

    validate()
  }, [pathname, isProtectedRoute])

  if (!isVerified) return null

  return <>{children}</>
}
