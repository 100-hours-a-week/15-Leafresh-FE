export const colorThemes = {
  lfBlack: {
    base: '#000000',
  },
  lfWhite: {
    base: '#FFFFFF',
  },
  lfGreenMain: {
    base: '#27824A',
    hover: '#227241',
  },
  lfGreenBorder: {
    base: '#03452E',
  },
  lfGreenDark: {
    base: '#294721',
    hover: '#355e2a',
  },

  lfGreenInactive: {
    base: '#8FBF97',
  },
  lfRed: {
    base: '#CC3535',
    hover: '#C03131',
  },
  lfBlue: {
    base: '#2D69AF',
    hover: '#285E9D',
  },
  lfLightGray: {
    base: '#D9D9D9',
  },
  lfInputBackground: {
    base: '#EBEBEB',
  },
  lfGray: {
    base: '#B0ABAB',
  },
  lfBackdrop: {
    base: '#70707066',
  },
  lfDarkGray: {
    base: '#5D5F62',
  },
}

export const fontSizeThemes = {
  xss: '10px',
  xs: '12px',
  sm: '14px',
  base: '16px',
  md: '18px',
  lg: '20px',
  xl: '22px',
}

const fontWeightThemes = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
}

const fontFamilyThemes = {
  pretendard: 'var(--font-pretendard), sans-serif',
}

const shadowThemes = {
  lfPrime: '1px 2px 3px 0px #00000040',
  lfInput: '0px 2px 4px 0px #3C404340',
}

const borderRadiusThemes = {
  xss: '2px',
  xs: '4px',
  sm: '6px',
  base: '8px',
  md: '10px',
  lg: '12px',
  xl: '14px',
  full: '9999px',
}

const breakPointThemes = {
  mobile: '390px',
  tablet: '768px',
  desktop: '1024px',
}

export const theme = {
  colors: colorThemes,
  fontSize: fontSizeThemes,
  fontWeight: fontWeightThemes,
  fontFamily: fontFamilyThemes,
  shadow: shadowThemes,
  radius: borderRadiusThemes,
  breakPoints: breakPointThemes,
}
