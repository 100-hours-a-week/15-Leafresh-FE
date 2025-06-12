
//ChatBubble에 들어갈 ReactNode[] 형태로 변환
export function formatChallengeResponse(challenges: { title: string; description: string }[]): string {
  return challenges.map((ch, i) => `${i + 1}. ${ch.title}\n  ${ch.description}`).join('\n\n')
}
