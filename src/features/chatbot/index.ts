// 챗봇 API 모듈 인덱스 파일
import {
  CATEGORY_RECOMMENDATION_ENDPOINT,
  requestCategoryBasedRecommendation,
  CategoryRecommendationRequestDTO,
  ChallengeDTO,
  RecommendationResponseDataDTO,
} from './chatbot-base-info'

import {
  FREETEXT_RECOMMENDATION_ENDPOINT,
  requestFreetextBasedRecommendation,
  FreetextRecommendationRequestDTO,
} from './chatbot-free-text'

// 엔드포인트를 CHATBOT_ENDPOINTS 객체로 묶어서 내보내기 (원본 코드 형태 유지)
export const CHATBOT_ENDPOINTS = {
  CATEGORY: CATEGORY_RECOMMENDATION_ENDPOINT,
  CHATTING: FREETEXT_RECOMMENDATION_ENDPOINT,
}

export {
  // 카테고리 기반 추천
  CATEGORY_RECOMMENDATION_ENDPOINT,
  requestCategoryBasedRecommendation,
}

// 타입 내보내기 - isolatedModules 설정 때문에 export type 사용
export type { CategoryRecommendationRequestDTO }

export {
  // 자유 텍스트 기반 추천
  FREETEXT_RECOMMENDATION_ENDPOINT,
  requestFreetextBasedRecommendation,
}

// 타입 내보내기 - isolatedModules 설정 때문에 export type 사용
export type { FreetextRecommendationRequestDTO }

// 공통 응답 타입 - isolatedModules 설정 때문에 export type 사용
export type { ChallengeDTO, RecommendationResponseDataDTO }
