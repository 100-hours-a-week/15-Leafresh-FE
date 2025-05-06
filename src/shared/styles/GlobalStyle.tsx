'use client'
import emotionReset from 'emotion-reset'

import { css, Global, Theme, useTheme } from '@emotion/react'
// import { theme } from '../emotion/theme'

const GlobalStyle = () => {
  const theme: Theme = useTheme()

  return (
    <Global
      styles={css`
        ${emotionReset}

        html,
        body {
          max-width: 100vw;

          color: ${theme.colors.lfBlack.base};
          background-color: ${theme.colors.lfWhite.base};
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        html {
          display: flex;
          justify-content: center;
          align-items: start;
        }

        body {
          width: 100%;
          /* min-width: 320px;
          max-width: 500px; */
          height: 100dvh;

          background-color: ${theme.colors.lfGray.base};

          color: black;

          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }

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
