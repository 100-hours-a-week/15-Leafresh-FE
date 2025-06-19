import { theme } from './theme'

export type ThemeType = typeof theme

export type ThemeColorType = keyof ThemeType['colors']
export type ThemeFontSizeType = keyof ThemeType['fontSize']
