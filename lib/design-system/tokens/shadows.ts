/**
 * Design Tokens - Shadow System
 * Smart Carbon-Free Village Design System
 */

export type ShadowSystem = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
};

// Professional shadow system for government/corporate look
export const shadows: ShadowSystem = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
};

// Colored shadows for specific use cases
export const coloredShadows = {
  // Primary color shadows
  primary: {
    sm: '0 1px 3px 0 rgb(6 19 53 / 0.1), 0 1px 2px -1px rgb(6 19 53 / 0.1)',
    md: '0 4px 6px -1px rgb(6 19 53 / 0.1), 0 2px 4px -2px rgb(6 19 53 / 0.1)',
    lg: '0 10px 15px -3px rgb(6 19 53 / 0.1), 0 4px 6px -4px rgb(6 19 53 / 0.1)',
  },
  
  // Success shadows
  success: {
    sm: '0 1px 3px 0 rgb(34 197 94 / 0.1), 0 1px 2px -1px rgb(34 197 94 / 0.1)',
    md: '0 4px 6px -1px rgb(34 197 94 / 0.1), 0 2px 4px -2px rgb(34 197 94 / 0.1)',
    lg: '0 10px 15px -3px rgb(34 197 94 / 0.1), 0 4px 6px -4px rgb(34 197 94 / 0.1)',
  },
  
  // Warning shadows
  warning: {
    sm: '0 1px 3px 0 rgb(245 158 11 / 0.1), 0 1px 2px -1px rgb(245 158 11 / 0.1)',
    md: '0 4px 6px -1px rgb(245 158 11 / 0.1), 0 2px 4px -2px rgb(245 158 11 / 0.1)',
    lg: '0 10px 15px -3px rgb(245 158 11 / 0.1), 0 4px 6px -4px rgb(245 158 11 / 0.1)',
  },
  
  // Error shadows
  error: {
    sm: '0 1px 3px 0 rgb(239 68 68 / 0.1), 0 1px 2px -1px rgb(239 68 68 / 0.1)',
    md: '0 4px 6px -1px rgb(239 68 68 / 0.1), 0 2px 4px -2px rgb(239 68 68 / 0.1)',
    lg: '0 10px 15px -3px rgb(239 68 68 / 0.1), 0 4px 6px -4px rgb(239 68 68 / 0.1)',
  },
} as const;

// Component-specific shadows
export const componentShadows = {
  // Button shadows
  button: {
    default: shadows.sm,
    hover: shadows.md,
    active: shadows.xs,
    focus: '0 0 0 3px rgb(59 130 246 / 0.1)',
  },
  
  // Card shadows
  card: {
    default: shadows.sm,
    hover: shadows.md,
    elevated: shadows.lg,
  },
  
  // Modal shadows
  modal: {
    backdrop: 'rgba(0, 0, 0, 0.5)',
    content: shadows['2xl'],
  },
  
  // Dropdown shadows
  dropdown: {
    content: shadows.lg,
  },
  
  // Navigation shadows
  nav: {
    header: shadows.sm,
    sidebar: shadows.lg,
  },
  
  // Form element shadows
  form: {
    input: shadows.xs,
    inputFocus: '0 0 0 3px rgb(59 130 246 / 0.1)',
    inputError: '0 0 0 3px rgb(239 68 68 / 0.1)',
    inputSuccess: '0 0 0 3px rgb(34 197 94 / 0.1)',
  },
} as const;

// Animation-ready shadow utilities
export const animatableShadows = {
  // Elevation levels
  elevation: {
    0: shadows.none,
    1: shadows.xs,
    2: shadows.sm,
    3: shadows.md,
    4: shadows.lg,
    5: shadows.xl,
    6: shadows['2xl'],
  },
  
  // Interactive states
  interactive: {
    rest: shadows.sm,
    hover: shadows.md,
    active: shadows.xs,
    disabled: shadows.none,
  },
} as const;

export type ShadowKey = keyof typeof shadows;
export type ColoredShadowKey = keyof typeof coloredShadows;
export type ComponentShadowKey = keyof typeof componentShadows;