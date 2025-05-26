'use client'
import emotionReset from 'emotion-reset'

import { css, Global, keyframes, Theme, useTheme } from '@emotion/react'
// import { theme } from '../emotion/theme'
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

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

          background: linear-gradient(
            -45deg,
            ${theme.colors.lfGreenInactive.base},
            ${theme.colors.lfInputBackground.base},
            #d1e8d4,
            ${theme.colors.lfGreenInactive.base}
          );
          background-size: 400% 400%;
          animation: ${gradientAnimation} 15s ease infinite;

          color: ${theme.colors.lfBlack.base};
          overflow-x: hidden;
          box-shadow: 0 0 40px #0000001a;
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
