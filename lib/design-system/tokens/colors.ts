/**
 * Design Tokens - Color System
 * Smart Carbon-Free Village Design System
 * 
 * Four professional government-inspired color palettes with psychological rationale
 */

export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

export type ColorPalette = {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
};

// Palette A: Trust & Authority (Government Style)
export const trustAuthorityPalette: ColorPalette = {
  primary: {
    50: '#f0f4ff',
    100: '#e5edff',
    200: '#cddbfe',
    300: '#a4cafe',
    400: '#7c3aed',
    500: '#061335', // Deep Navy - Primary
    600: '#050f2a',
    700: '#040b20',
    800: '#030715',
    900: '#02040b',
    950: '#010205',
  },
  secondary: {
    50: '#fffdf0',
    100: '#fffadc',
    200: '#fff4b8',
    300: '#ffec85',
    400: '#F6C85F', // Warm Gold - Secondary
    500: '#f0b13e',
    600: '#e5950f',
    700: '#c2720a',
    800: '#9f570e',
    900: '#824510',
    950: '#471f02',
  },
  accent: {
    50: '#f0fdff',
    100: '#ccfbfe',
    200: '#99f6fe',
    300: '#5beafc',
    400: '#00A3B7', // Sky Teal - Accent
    500: '#0891b2',
    600: '#0e7490',
    700: '#155e75',
    800: '#164e63',
    900: '#083344',
    950: '#042f2e',
  },
  neutral: {
    50: '#F4F6F9', // Ash Gray - Neutral
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
};

// Palette B: Eco-Futuristic (Sustainable)
export const ecoFuturisticPalette: ColorPalette = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#0B6E4F', // Earthy Green - Primary
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  secondary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#FF8A00', // Sunrise Orange - Secondary
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  accent: {
    50: '#fffdf7',
    100: '#fffbeb',
    200: '#FDF6E3', // Soft Sand - Accent
    300: '#fde68a',
    400: '#fcd34d',
    500: '#fbbf24',
    600: '#f59e0b',
    700: '#d97706',
    800: '#b45309',
    900: '#92400e',
    950: '#78350f',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#2E3A59', // Slate - Neutral
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
};

// Palette C: Modern Government Luxe
export const modernGovLuxePalette: ColorPalette = {
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#0B132B', // Indigo - Primary
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  secondary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#00B4D8', // Cyan - Secondary
    500: '#0891b2',
    600: '#0e7490',
    700: '#155e75',
    800: '#164e63',
    900: '#083344',
    950: '#042f2e',
  },
  accent: {
    50: '#fffdf7',
    100: '#fffbeb',
    200: '#fef3c7',
    300: '#fde68a',
    400: '#FFD166', // Gold - Accent
    500: '#fbbf24',
    600: '#f59e0b',
    700: '#d97706',
    800: '#b45309',
    900: '#92400e',
    950: '#78350f',
  },
  neutral: {
    50: '#FCFCFD', // Ivory - Neutral
    100: '#f9fafb',
    200: '#f3f4f6',
    300: '#e5e7eb',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
};

// Palette D: Village Heritage (Cultural)
export const villageHeritagePalette: ColorPalette = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#4A6FA5', // Himalayan Blue - Primary
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  secondary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#FF9933', // Saffron - Secondary
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#138808', // Forest Green - Accent
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  neutral: {
    50: '#F5F5DC', // Stone Gray - Neutral
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
};

// Theme definitions with psychological rationale
export const themes = {
  'trust-authority': {
    name: 'Trust & Authority',
    description: 'Professional government style with deep navy, warm gold, and sky teal',
    psychology: 'Authority, optimism, clarity, trust',
    palette: trustAuthorityPalette,
  },
  'eco-futuristic': {
    name: 'Eco-Futuristic',
    description: 'Sustainable design with earthy green, sunrise orange, and soft sand',
    psychology: 'Sustainability, warmth, growth, innovation',
    palette: ecoFuturisticPalette,
  },
  'modern-gov-luxe': {
    name: 'Modern Government Luxe',
    description: 'Sophisticated design with indigo, cyan, and gold accents',
    psychology: 'Innovation, stability, prosperity, professionalism',
    palette: modernGovLuxePalette,
  },
  'village-heritage': {
    name: 'Village Heritage',
    description: 'Cultural design with Himalayan blue, saffron, and forest green',
    psychology: 'Heritage, culture, nature connection, authenticity',
    palette: villageHeritagePalette,
  },
} as const;

export type ThemeName = keyof typeof themes;

// Default theme
export const defaultTheme: ThemeName = 'trust-authority';

// Current theme (will be configurable via admin)
export let currentTheme: ThemeName = defaultTheme;

export const getCurrentPalette = (): ColorPalette => {
  return themes[currentTheme].palette;
};

export const setCurrentTheme = (themeName: ThemeName): void => {
  currentTheme = themeName;
};

export const getAllThemes = () => themes;