import '@emotion/react'
import { ThemeType } from './theme/type'

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}
