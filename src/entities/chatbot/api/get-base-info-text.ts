import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

/**
 * 카테고리 기반 챌린지 추천 요청 DTO
 */
export type CategoryRecommendationRequestDTO = {
  sessionId: string
  location: string /** 위치 정보 (필수) */
  workType: string /** 업무 타입 (필수) */
  category: string /** 카테고리 (필수) */
}

/**
 * 챌린지 정보 타입
 */
export type ChallengeDTO = {
  title: string /** 챌린지 제목 */
  description: string /** 챌린지 설명 */
}

/**
 * 챌린지 추천 응답 데이터 타입
 */
export type RecommendationResponseDataDTO = {
  recommend: string /** 추천 설명 */
  challenges: ChallengeDTO[] /** 추천된 챌린지 목록 */
}

/**
 * 카테고리 기반 챌린지 추천 요청 API
 * @param body 카테고리 기반 추천 요청 데이터 (location, workType, category 필수)
 * @returns 추천된 챌린지 목록
 *
 * @throws 400 - 필수 필드 누락 ("location은 필수입니다.", "workType은 필수입니다.", "category는 필수입니다.")
 * @throws 400 - 유효하지 않은 선택 항목 ("유효하지 않은 선택 항목이 포함되어 있습니다.")
 * @throws 500 - 서버 내부 오류 ("서버 내부 오류로 추천에 실패했습니다.")
 * @throws 502 - AI 서버 연결 실패 ("AI 서버로부터 추천 결과를 받아오는 데 실패했습니다.")
 */
export const requestCategoryBasedRecommendation = (body: CategoryRecommendationRequestDTO) => {
  return fetchRequest(ENDPOINTS.CHATBOT.CATEGORY, { body })
}
