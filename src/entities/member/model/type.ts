import { OAuth } from './constant'

/** 인증 성공 여부 */
export type OAuthType = (typeof OAuth)[number]
export type LowercaseOAuthType = Lowercase<OAuthType> // 'kakao'
