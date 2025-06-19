import { useUserStore } from '@entities/member/context/UserStore'

/** 유저 정보와 로그인 상태를 반환하는 커스텀 훅 */
export function useAuth() {
  const { userInfo } = useUserStore()
  const isLoggedIn = !!userInfo

  return {
    userInfo,
    isLoggedIn,
  }
}
