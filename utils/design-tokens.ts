export const designTokens = {
  color: {
    background: '#FFFFFF',
    backgroundWarm: '#fff8ed',
    brandRed: '#99041e',
    brandRedDark: '#7f0318',
    brandYellow: '#ffc257',
    text: '#1a120f',
    textMuted: '#6b5b55',
    borderGold: '#f0d59d',
    success: '#126336',
    heat: '#d86222',
  },
  container: {
    default: 'max-w-[1240px]',
    wide: 'max-w-[1320px]',
    narrow: 'max-w-[960px]',
  },
  radius: {
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },
  shadow: {
    soft: '0 14px 40px rgba(50, 24, 16, 0.08)',
    card: '0 18px 50px rgba(50, 24, 16, 0.10)',
    lift: '0 24px 70px rgba(50, 24, 16, 0.16)',
  },
} as const;
