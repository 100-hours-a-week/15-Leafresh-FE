export const CHALLENGE_RATIOS = {
  THUMBNAIL: '14/9',
  VERIFICATION: '5/3',
}
export const ASPECT_RATIOS = {
  SQUARE: '1/1',
  THREE_TWO: '3/2',
  FOUR_THREE: '4/3',
  FIVE_THREE: '5/3',
  TWO_ONE: '2/1',
  FIVE_TWO: '5/2',
} as const

export const ASPECT_RATIO = {
  GENERAL: {
    ...ASPECT_RATIOS,
  },
  CHALLENGE: { ...CHALLENGE_RATIOS },
}

export type AspectRatioType = keyof typeof ASPECT_RATIOS
