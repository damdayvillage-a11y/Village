/**
 * Design Tokens - Motion System
 * Smart Carbon-Free Village Design System
 */

export type Duration = {
  instant: string;
  fast: string;
  normal: string;
  slow: string;
  slower: string;
};

export type Easing = {
  linear: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  bounce: string;
  elastic: string;
};

// Animation durations (government websites prefer subtle, not distracting)
export const duration: Duration = {
  instant: '0ms',
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
};

// Easing functions for professional feel
export const easing: Easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// Pre-defined animations for common use cases
export const animations = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: duration.normal,
    easing: easing.easeOut,
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: duration.normal,
    easing: easing.easeIn,
  },
  
  // Slide animations
  slideInUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: duration.normal,
    easing: easing.easeOut,
  },
  slideInDown: {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: duration.normal,
    easing: easing.easeOut,
  },
  slideInLeft: {
    from: { transform: 'translateX(-20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
    duration: duration.normal,
    easing: easing.easeOut,
  },
  slideInRight: {
    from: { transform: 'translateX(20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
    duration: duration.normal,
    easing: easing.easeOut,
  },
  
  // Scale animations
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: duration.normal,
    easing: easing.easeOut,
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.95)', opacity: 0 },
    duration: duration.fast,
    easing: easing.easeIn,
  },
  
  // Rotation animations
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    duration: '1000ms',
    easing: easing.linear,
  },
  
  // Pulse animation
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    duration: '2000ms',
    easing: easing.easeInOut,
    iterationCount: 'infinite',
  },
  
  // Bounce animation (subtle for professional use)
  bounceSubtle: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-2px)' },
    duration: '1000ms',
    easing: easing.easeInOut,
    iterationCount: 'infinite',
  },
} as const;

// Component-specific motion presets
export const componentMotion = {
  // Button interactions
  button: {
    hover: {
      scale: 1.02,
      duration: duration.fast,
      easing: easing.easeOut,
    },
    tap: {
      scale: 0.98,
      duration: duration.instant,
      easing: easing.easeInOut,
    },
    focus: {
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      duration: duration.fast,
      easing: easing.easeOut,
    },
  },
  
  // Card interactions
  card: {
    hover: {
      y: -2,
      duration: duration.normal,
      easing: easing.easeOut,
    },
    tap: {
      scale: 0.98,
      duration: duration.fast,
      easing: easing.easeInOut,
    },
  },
  
  // Modal animations
  modal: {
    enter: {
      backdrop: animations.fadeIn,
      content: animations.scaleIn,
    },
    exit: {
      backdrop: animations.fadeOut,
      content: animations.scaleOut,
    },
  },
  
  // Dropdown animations
  dropdown: {
    enter: animations.slideInDown,
    exit: animations.fadeOut,
  },
  
  // Navigation animations
  nav: {
    mobileMenuEnter: animations.slideInRight,
    mobileMenuExit: animations.slideInRight,
    submenuEnter: animations.fadeIn,
    submenuExit: animations.fadeOut,
  },
  
  // Form animations
  form: {
    error: {
      x: [-2, 2, -2, 2, 0],
      duration: duration.normal,
      easing: easing.easeInOut,
    },
    success: animations.bounceSubtle,
  },
  
  // Loading animations
  loading: {
    spinner: animations.spin,
    pulse: animations.pulse,
    skeleton: {
      backgroundPosition: ['200% 0', '-200% 0'],
      duration: '1500ms',
      easing: easing.linear,
      iterationCount: 'infinite',
    },
  },
} as const;

// Page transition presets
export const pageTransitions = {
  default: {
    enter: animations.fadeIn,
    exit: animations.fadeOut,
  },
  slide: {
    enter: animations.slideInRight,
    exit: animations.slideInLeft,
  },
  scale: {
    enter: animations.scaleIn,
    exit: animations.scaleOut,
  },
} as const;

// Reduced motion preferences
export const reducedMotionPresets = {
  // Safe animations that respect reduced motion preference
  safeAnimations: {
    fadeIn: { opacity: [0, 1] },
    fadeOut: { opacity: [1, 0] },
    // Avoid transform animations for reduced motion
  },
  
  // Instant alternatives for reduced motion
  instantAlternatives: {
    duration: duration.instant,
    easing: easing.linear,
  },
} as const;

// Animation utilities
export const animationUtils = {
  // Stagger children animations
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.2,
  },
  
  // Delay presets
  delay: {
    none: '0ms',
    xs: '50ms',
    sm: '100ms',
    md: '200ms',
    lg: '300ms',
    xl: '500ms',
  },
} as const;

export type DurationKey = keyof typeof duration;
export type EasingKey = keyof typeof easing;
export type AnimationKey = keyof typeof animations;