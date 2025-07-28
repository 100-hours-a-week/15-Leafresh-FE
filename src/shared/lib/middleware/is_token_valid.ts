interface IsValidTokenProps {
  accessToken?: string
  refreshToken?: string
}

/**
 * JWT 토큰의 남은 시간 여부를 반환하는 함수 (not 쿠키 유효시간)
 * @param accessToken 엑세스 토큰
 * @param refreshToken 리프레시 토큰
 * @returns 남은 시간 여부
 */
const isValidToken = ({ accessToken, refreshToken }: IsValidTokenProps) => {
  const currentTime: number = Math.floor(Date.now() / 1000) // 현재 시간을 초 단위로 가져오기 (Unix Timestamp 형식)

  const result: {
    isAccessTokenValid?: boolean
    isRefreshTokenValid?: boolean
  } = {}

  try {
    // 액세스 토큰 디코딩하여 만료 시간(`exp`) 확인
    if (accessToken) {
      const accessTokenPayload = JSON.parse(atob(accessToken.split('.')[1])) // JWT의 payload 부분(base64) 디코딩
      result.isAccessTokenValid = accessTokenPayload.exp > currentTime // 현재 시간과 만료 시간을 비교하여 유효성 판단
    }

    // 리프레쉬 디코딩하여 만료 시간(`exp`) 확인
    if (refreshToken) {
      const refreshTokenPayload = JSON.parse(atob(refreshToken.split('.')[1])) // JWT의 payload 부분(base64) 디코딩
      result.isRefreshTokenValid = refreshTokenPayload.exp > currentTime // 현재 시간과 만료 시간을 비교하여 유효성 판단
    }
  } catch (error) {
    console.error('토큰 디코딩 실패:', error)
  }

  return result
}

export default isValidToken
