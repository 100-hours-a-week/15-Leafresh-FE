'use client'
import emotionReset from 'emotion-reset'

import { css, Global, Theme, useTheme } from '@emotion/react'

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

          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;

          line-height: 1.3;
        }

        html {
          display: flex;
          justify-content: center;
          align-items: start;
        }

        body {
          width: 100%;
          min-height: 100dvh;

          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-start;

          color: ${theme.colors.lfBlack.base};
          overflow-x: hidden;
          box-shadow: 0 0 40px #0000001a;

          background-image: url('/image/background.svg');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }

        ::-webkit-scrollbar {
          width: 12px;
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
