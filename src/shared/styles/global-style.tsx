'use client'
import emotionReset from 'emotion-reset'

import { css, Global, Theme, useTheme } from '@emotion/react'

export const GlobalStyle = () => {
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

        /* 스크롤바 전체 영역 */
        ::-webkit-scrollbar {
          width: 6px; /* 세로 스크롤바 두께 */
          height: 6px; /* 가로 스크롤바 두께 */
        }

        /* 스크롤바 트랙(배경 영역) */
        ::-webkit-scrollbar-track {
          background: #f0f0f0; /* 트랙 색상 */
          border-radius: 4px;
        }

        /* 스크롤바 썸(움직이는 바) */
        ::-webkit-scrollbar-thumb {
          background: #728b5c;
          border-radius: 4px;
        }

        /* 썸에 호버 효과 추가 */
        ::-webkit-scrollbar-thumb:hover {
          background: #7d9865;
        }
      `}
    />
  )
}
