import { theme, ThemeColorType, ThemeFontSizeType } from '@/shared/config'

export const getThemeColor = (key?: ThemeColorType) => {
  if (!key) return undefined
  return theme.colors[key]?.base
}

export const getThemeFontSize = (key?: ThemeFontSizeType) => {
  if (!key) return undefined
  return theme.fontSize[key]
}
