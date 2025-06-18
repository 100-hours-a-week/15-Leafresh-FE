import React from 'react'

//ChatBubble에 들어갈 ReactNode[] 형태로 변환
export function formatChallengeResponse(challenges: Array<{ title: string; description: string }>): React.ReactNode[] {
  return challenges.flatMap((ch, idx) => [
    // `${idx + 1}. ${ch.title}` 은 문자열로,
    // 줄바꿈을 위해 <br />를 삽입합니다.
    `${idx + 1}. ${ch.title}`,
    <br key={`title-${idx}`} />,
    `  ${ch.description}`, // 앞에 공백 두 칸(U+00A0)을 추가
    <br key={`desc-${idx}`} />,
    <br key={`gap-${idx}`} />,
  ])
}
