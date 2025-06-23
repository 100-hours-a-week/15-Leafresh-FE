import { ThemeColorType, ThemeFontSizeType } from '@/shared/config'
import { colorThemes, fontSizeThemes } from '@/shared/config/style/theme'

export const getThemeColor = (key?: ThemeColorType) => {
  if (!key) return undefined
  return colorThemes[key]?.base
}

export const getThemeFontSize = (key?: ThemeFontSizeType) => {
  if (!key) return undefined
  return fontSizeThemes[key]
}
