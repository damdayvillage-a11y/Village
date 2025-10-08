/**
 * Design Tokens - Typography System
 * Smart Carbon-Free Village Design System
 */

export type FontWeight = {
  thin: number;
  extralight: number;
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
  black: number;
};

export type FontSize = {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
  '7xl': string;
  '8xl': string;
  '9xl': string;
};

export type LineHeight = {
  none: string;
  tight: string;
  snug: string;
  normal: string;
  relaxed: string;
  loose: string;
};

export type LetterSpacing = {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
};

export type FontFamily = {
  sans: string[];
  serif: string[];
  mono: string[];
  display: string[];
};

// Font stacks optimized for government and professional websites
export const fontFamilies: FontFamily = {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ],
  serif: [
    'Charter',
    'Georgia',
    '"Times New Roman"',
    'Times',
    'serif',
  ],
  mono: [
    '"JetBrains Mono"',
    'Menlo',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    '"Courier New"',
    'monospace',
  ],
  display: [
    '"Playfair Display"',
    'Charter',
    'Georgia',
    '"Times New Roman"',
    'serif',
  ],
};

// Font weights
export const fontWeights: FontWeight = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// Font sizes with consistent scale
export const fontSizes: FontSize = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
  '7xl': '4.5rem',   // 72px
  '8xl': '6rem',     // 96px
  '9xl': '8rem',     // 128px
};

// Line heights
export const lineHeights: LineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
};

// Letter spacing
export const letterSpacing: LetterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

// Text style combinations for consistency
export const textStyles = {
  // Display styles
  'display-2xl': {
    fontSize: fontSizes['8xl'],
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.tighter,
    fontWeight: fontWeights.bold,
  },
  'display-xl': {
    fontSize: fontSizes['7xl'],
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.tighter,
    fontWeight: fontWeights.bold,
  },
  'display-lg': {
    fontSize: fontSizes['6xl'],
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.tight,
    fontWeight: fontWeights.bold,
  },
  'display-md': {
    fontSize: fontSizes['5xl'],
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    fontWeight: fontWeights.semibold,
  },
  'display-sm': {
    fontSize: fontSizes['4xl'],
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.semibold,
  },

  // Heading styles
  'heading-xl': {
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.semibold,
  },
  'heading-lg': {
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.semibold,
  },
  'heading-md': {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.semibold,
  },
  'heading-sm': {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.medium,
  },

  // Body text styles
  'body-xl': {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.normal,
  },
  'body-lg': {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.normal,
  },
  'body-md': {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.normal,
  },
  'body-sm': {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.normal,
  },
  'body-xs': {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    fontWeight: fontWeights.normal,
  },

  // Label styles
  'label-lg': {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.medium,
  },
  'label-md': {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.medium,
  },
  'label-sm': {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    fontWeight: fontWeights.medium,
  },

  // Code styles
  'code-lg': {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.normal,
  },
  'code-md': {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.normal,
  },
  'code-sm': {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.normal,
  },
} as const;

export type TextStyleName = keyof typeof textStyles;

// Helper function to get text style CSS
export const getTextStyle = (styleName: TextStyleName) => {
  return textStyles[styleName];
};

// Web font imports for Google Fonts (to be added to head)
export const webFontImports = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap',
];

// Font loading strategy
export const fontLoadingStrategy = {
  preload: [
    {
      href: webFontImports[0],
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
  ],
  fallbacks: {
    inter: 'system-ui, -apple-system, sans-serif',
    playfair: 'Georgia, serif',
    jetbrains: 'Menlo, Monaco, monospace',
  },
};