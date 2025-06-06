import { theme } from '../theme'

const breakpoints = theme.breakPoints

export const media = {
  afterMobile: `@media (min-width: ${breakpoints.mobile})`,
  afterTablet: `@media (min-width: ${breakpoints.tablet})`,
  afterDesktop: `@media (min-width: ${breakpoints.desktop})`,
}
