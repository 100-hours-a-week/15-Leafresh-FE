'use client'

import { css, Global } from '@emotion/react'

import { theme } from '@shared/styles/theme/theme'

const GlobalScrollbarStyle = () => (
  <Global
    styles={css`
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        border-radius: 5px;
      }

      ::-webkit-scrollbar-thumb {
        background: ${theme.colors.lfGray.base};
        border-radius: 5px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: ${theme.colors.lfDarkGray.base};
      }
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
    `}
  />
)

export default GlobalScrollbarStyle
