'use client'
import { css, Global, Theme, useTheme } from '@emotion/react'
// import { theme } from '../emotion/theme'

const GlobalStyle = () => {
  const theme: Theme = useTheme()

  return (
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
          background: ${theme.colors.lfDarkGray.base};
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
}

export default GlobalStyle
