import { theme } from '.'
import { ThemeColorType } from './type'

export const getThemeColor = (key?: ThemeColorType) => {
  if (!key) return undefined
  return theme.colors[key]?.base
}
