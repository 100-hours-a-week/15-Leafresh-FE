import { theme } from '.'

export type ThemeType = typeof theme

export type ThemeColorType = keyof ThemeType['colors']
export type ThemeFontSizeType = keyof ThemeType['fontSize']
