'use client'

import { usePathname, useRouter } from 'next/navigation'

import { useValidateMemberProfile } from '@/features/member/api'

import { URL } from '@/shared/constants'
import { useToast } from '@/shared/hooks'

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

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const isProtectedRoute = PROTECTED_ROUTES.some(pattern => new RegExp(`^${pattern}$`).test(pathname))

  const onAuthGuardError = () => {
    toast('Error', '로그인이 필요합니다')
    router.replace(URL.MEMBER.LOGIN.value)
  }

  const { isAuthVerified } = useValidateMemberProfile({
    enabled: isProtectedRoute,
    onError: onAuthGuardError,
  })

  if (!isAuthVerified) return null

  return <>{children}</>
}
