/**
 * Design System Tokens - Main Export
 * Smart Carbon-Free Village Design System
 * 
 * Centralized design tokens for consistent theming across the application
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './motion';

import { 
  themes, 
  getCurrentPalette, 
  setCurrentTheme, 
  type ThemeName,
  type ColorPalette,
  defaultTheme
} from './colors';

import { 
  fontFamilies, 
  fontSizes, 
  fontWeights, 
  lineHeights, 
  textStyles,
  type TextStyleName 
} from './typography';

import { 
  spacing, 
  componentSpacing, 
  dimensions, 
  borderRadius,
  zIndex 
} from './spacing';

import { 
  shadows, 
  componentShadows, 
  coloredShadows 
} from './shadows';

import { 
  duration, 
  easing, 
  animations, 
  componentMotion 
} from './motion';

// Complete design system interface
export interface DesignSystem {
  colors: ColorPalette;
  typography: {
    families: typeof fontFamilies;
    sizes: typeof fontSizes;
    weights: typeof fontWeights;
    lineHeights: typeof lineHeights;
    styles: typeof textStyles;
  };
  spacing: {
    scale: typeof spacing;
    components: typeof componentSpacing;
    dimensions: typeof dimensions;
  };
  borders: {
    radius: typeof borderRadius;
  };
  shadows: {
    base: typeof shadows;
    components: typeof componentShadows;
    colored: typeof coloredShadows;
  };
  motion: {
    duration: typeof duration;
    easing: typeof easing;
    animations: typeof animations;
    components: typeof componentMotion;
  };
  zIndex: typeof zIndex;
}

// Get complete design system for current theme
export const getDesignSystem = (): DesignSystem => ({
  colors: getCurrentPalette(),
  typography: {
    families: fontFamilies,
    sizes: fontSizes,
    weights: fontWeights,
    lineHeights: lineHeights,
    styles: textStyles,
  },
  spacing: {
    scale: spacing,
    components: componentSpacing,
    dimensions: dimensions,
  },
  borders: {
    radius: borderRadius,
  },
  shadows: {
    base: shadows,
    components: componentShadows,
    colored: coloredShadows,
  },
  motion: {
    duration,
    easing,
    animations,
    components: componentMotion,
  },
  zIndex,
});

// CSS Custom Properties generator
export const generateCSSCustomProperties = (themeName?: ThemeName): string => {
  const theme = themeName || defaultTheme;
  const palette = themes[theme].palette;
  
  const cssProperties: string[] = [
    ':root {',
    
    // Color properties
    ...Object.entries(palette).flatMap(([colorType, colorScale]) =>
      Object.entries(colorScale).map(([shade, value]) =>
        `  --color-${colorType}-${shade}: ${value};`
      )
    ),
    
    // Typography properties
    ...Object.entries(fontSizes).map(([size, value]) =>
      `  --font-size-${size}: ${value};`
    ),
    ...Object.entries(fontWeights).map(([weight, value]) =>
      `  --font-weight-${weight}: ${value};`
    ),
    ...Object.entries(lineHeights).map(([height, value]) =>
      `  --line-height-${height}: ${value};`
    ),
    
    // Spacing properties
    ...Object.entries(spacing).map(([size, value]) =>
      `  --spacing-${size}: ${value};`
    ),
    
    // Border radius properties
    ...Object.entries(borderRadius).map(([size, value]) =>
      `  --border-radius-${size}: ${value};`
    ),
    
    // Shadow properties
    ...Object.entries(shadows).map(([size, value]) =>
      `  --shadow-${size}: ${value};`
    ),
    
    // Motion properties
    ...Object.entries(duration).map(([speed, value]) =>
      `  --duration-${speed}: ${value};`
    ),
    ...Object.entries(easing).map(([curve, value]) =>
      `  --easing-${curve}: ${value};`
    ),
    
    // Z-index properties
    ...Object.entries(zIndex).map(([layer, value]) =>
      `  --z-index-${layer}: ${value};`
    ),
    
    '}',
  ];
  
  return cssProperties.join('\n');
};

// Tailwind config generator
export const generateTailwindConfig = (themeName?: ThemeName) => {
  const theme = themeName || defaultTheme;
  const palette = themes[theme].palette;
  
  return {
    theme: {
      extend: {
        colors: Object.fromEntries(
          Object.entries(palette).map(([colorType, colorScale]) => [
            colorType,
            colorScale
          ])
        ),
        fontFamily: fontFamilies,
        fontSize: fontSizes,
        fontWeight: fontWeights,
        lineHeight: lineHeights,
        spacing,
        borderRadius,
        boxShadow: shadows,
        transitionDuration: duration,
        transitionTimingFunction: easing,
        zIndex,
      },
    },
  };
};

// Theme utilities
export const themeUtils = {
  getAllThemes: () => themes,
  getCurrentTheme: getCurrentPalette,
  setTheme: setCurrentTheme,
  generateCSS: generateCSSCustomProperties,
  generateTailwindConfig,
  getDesignSystem,
};

// Export convenience functions
export {
  themes,
  getCurrentPalette,
  setCurrentTheme,
};