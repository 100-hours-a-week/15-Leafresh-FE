/**
 * 한글을 영어로, 영어를 한글로 바꿔주는 함수
 * 예시(영어 to 한글): convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'kor', 'eng')('업사이클링')
 */
export const convertLanguage = <
  T extends readonly Record<string, string>[],
  FromKey extends keyof T[number],
  ToKey extends keyof T[number],
>(
  pairs: T,
  fromKey: FromKey,
  toKey: ToKey,
) => {
  return (fromValue: T[number][FromKey]): T[number][ToKey] | undefined => {
    return (pairs.find((pair: T[number]) => pair[fromKey] === fromValue) as T[number] | undefined)?.[toKey]
  }
}
