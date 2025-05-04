import '@emotion/react'
import { ThemeType } from '../type'

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}
