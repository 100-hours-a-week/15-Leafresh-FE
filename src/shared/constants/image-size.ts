export const ASPECT_RATIOS = {
  SQUARE: '1/1',
  THREE_TWO: '3/2',
  FOUR_THREE: '4/3',
  FIVE_THREE: '5/3',
  TWO_ONE: '2/1',
  FIVE_TWO: '5/2',
  CHALLENGE_THUMBNAIL: '14/9',
} as const

export type AspectRatioType = keyof typeof ASPECT_RATIOS
