import { fetchRequest, HttpMethod } from '@/shared/lib'

// 자유 텍스트 기반 챌린지 추천 요청 엔드포인트
export const FREETEXT_RECOMMENDATION_ENDPOINT = {
  method: HttpMethod.POST,
  path: '/api/chatbot/recommendation/free-text',
}

/**
 * 자유 텍스트 기반 챌린지 추천 요청 DTO
 */
export interface FreetextRecommendationRequestDTO {
  sessionId: string
  /** 위치 정보 (필수) */
  location: string
  /** 업무 타입 (필수) */
  workType: string
  /** 사용자 입력 메시지 (필수, 최소 5글자) */
  message: string
}

/**
 * 자유 텍스트 기반 챌린지 추천 요청 API
 * @param body 자유 텍스트 기반 추천 요청 데이터 (location, workType, message 필수)
 * @returns 추천된 챌린지 목록
 *
 * @throws 400 - 필수 필드 누락 ("message는 필수입니다.")
 * @throws 422 - 유효하지 않은 메시지 ("message는 문자열이어야 하며, 최소한의 의미를 가져야 합니다.")
 * @throws 500 - 서버 내부 오류 ("서버 내부 오류로 인해 챌린지 추천에 실패했습니다.")
 * @throws 502 - AI 서버 연결 실패 ("AI 서버로부터 추천 결과를 받아오는 데 실패했습니다.")
 */
export const requestFreetextBasedRecommendation = (body: FreetextRecommendationRequestDTO) => {
  // message가 5글자 이상인지 로컬에서 검증 (선택적)
  if (body.message && body.message.length < 5) {
    return Promise.reject({
      status: 422,
      message: 'message는 문자열이어야 하며, 최소한의 의미를 가져야 합니다.',
      data: null,
    })
  }

  return fetchRequest(FREETEXT_RECOMMENDATION_ENDPOINT, { body })
}
