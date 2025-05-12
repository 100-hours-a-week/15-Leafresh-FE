import '@emotion/react'
import { ThemeType } from '../../styles/theme/type'

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}
