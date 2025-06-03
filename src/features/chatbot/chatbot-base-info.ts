import { HttpMethod } from '@shared/constants/http'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

// 카테고리 기반 챌린지 추천 요청 엔드포인트
export const CATEGORY_RECOMMENDATION_ENDPOINT = {
  method: HttpMethod.POST,
  path: '/api/chatbot/recommendation/base-info',
}

export interface CategoryRecommendationRequest {
  sessionId: string
  location: string
  workType: string
  category: string
}

export type Challenge = {
  /** 챌린지 제목 */
  title: string
  /** 챌린지 설명 */
  description: string
}
export interface RecommendationResponse {
  /** 추천 설명 */
  recommend: string
  /** 추천된 챌린지 목록 */
  challenges: Challenge[]
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
export const requestCategoryBasedRecommendation = (body: CategoryRecommendationRequest) => {
  return fetchRequest(CATEGORY_RECOMMENDATION_ENDPOINT, { body })
}
