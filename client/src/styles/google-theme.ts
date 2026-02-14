// Google Material Design Theme System
export const googleTheme = {
  // Google's color palette
  colors: {
    primary: {
      50: '#1a73e8', // Google Blue
      100: '#4285f4', // Darker Blue
      200: '#8ab4f8', // Light Blue
      300: '#aecbfa', // Lighter Blue
      400: '#669df6', // Google Blue Gray
      500: '#9aa0a6', // Light Gray
      600: '#757575', // Darker Gray
      700: '#5f6368', // Darkest Gray
      800: '#424342', // Almost Black
      900: '#202124', // Black
    },
    secondary: {
      50: '#fbbc05', // Google Orange
      100: '#ea4335', // Darker Orange
      200: '#fdd835', // Light Orange
      300: '#fe6c8c', // Lighter Orange
      400: '#e0a215', // Orange Gray
      500: '#9e9a80', // Darker Orange
      600: '#d97706', // Darkest Orange
      700: '#cc7852', // Almost Black Orange
      800: '#424342', // Almost Black Orange
      900: '#1b1e3e', // Black Orange
    },
    success: {
      50: '#34a853', // Google Green
      100: '#137333', // Darker Green
      200: '#0f9d58', // Light Green
      300: '#e6f4ea', // Lighter Green
      400: '#b7df1d', // Green Gray
      500: '#81c784', // Darker Green
      600: '#33691e', // Darkest Green
      700: '#1e8e3e', // Almost Black Green
      800: '#2e7d32', // Almost Black Green
      900: '#0d652d', // Black Green
    },
    warning: {
      50: '#fbbc05', // Google Orange
      100: '#ea4335', // Darker Orange
      200: '#fdd835', // Light Orange
    },
    error: {
      50: '#ea4335', // Google Orange
      100: '#d93025', // Darker Red
    },
    background: {
      primary: '#ffffff', // White
      secondary: '#f8f9fa', // Google Light Gray
      tertiary: '#f1f3f4', // Even Lighter Gray
    },
    text: {
      primary: '#202124', // Almost Black
      secondary: '#5f6368', // Darker Gray
      tertiary: '#9aa0a6', // Light Gray
      disabled: '#9e9a80', // Darker Gray
    }
  },

  // Google's typography scale
  typography: {
    fontFamily: {
      primary: '"Google Sans", "Roboto", "Arial", sans-serif',
      secondary: '"Roboto Mono", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },

  // Google's spacing system (4px grid)
  spacing: {
    0: '0',      // 0px
    1: '0.25rem', // 4px
    2: '0.5rem',  // 8px
    3: '0.75rem', // 12px
    4: '1rem',    // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem',    // 32px
    10: '2.5rem', // 40px
    12: '3rem',   // 48px
    16: '4rem',   // 64px
    20: '5rem',   // 80px
    24: '6rem',   // 96px
  },

  // Google's border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',    // 16px
    full: '9999px', // Fully rounded
  },

  // Google's shadow system
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 4px 6px rgba(0, 0, 0, 0.07)',
    md: '0 10px 25px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px rgba(0, 0, 0, 0.15)',
    xl: '0 25px 50px rgba(0, 0, 0, 0.25)',
  },
};

// Google's animation easing functions
export const googleEasing = {
  // Material Design easing curves
  easeInOut: [0.4, 0.0, 0.2, 1.0],
  easeOut: [0.0, 0.0, 0.2, 1.0],
  easeIn: [0.4, 0.0, 0.6, 1.0],
  
  // Google's bounce effect
  bounce: {
    duration: 0.6,
    ease: [0.3, 0.0, 0.0, 1.0],
    time: 1500,
  },
  
  // Google's slide effect
  slide: {
    duration: 0.4,
    ease: [0.3, 0.0, 0.0, 1.0],
    stagger: 0.1,
  },
};

// CSS custom properties for Google theme
export const googleThemeVars = {
  '--google-primary-50': googleTheme.colors.primary[50],
  '--google-primary-100': googleTheme.colors.primary[100],
  '--google-primary-200': googleTheme.colors.primary[200],
  '--google-primary-300': googleTheme.colors.primary[300],
  '--google-primary-400': googleTheme.colors.primary[400],
  '--google-primary-500': googleTheme.colors.primary[500],
  '--google-primary-600': googleTheme.colors.primary[600],
  '--google-primary-700': googleTheme.colors.primary[700],
  '--google-secondary-50': googleTheme.colors.secondary[50],
  '--google-secondary-100': googleTheme.colors.secondary[100],
  '--google-secondary-200': googleTheme.colors.secondary[200],
  '--google-secondary-300': googleTheme.colors.secondary[300],
  '--google-secondary-400': googleTheme.colors.secondary[400],
  '--google-secondary-500': googleTheme.colors.secondary[500],
  '--google-success-50': googleTheme.colors.success[50],
  '--google-success-100': googleTheme.colors.success[100],
  '--google-success-200': googleTheme.colors.success[200],
  '--google-warning-50': googleTheme.colors.warning[50],
  '--google-warning-100': googleTheme.colors.warning[100],
  '--google-error-50': googleTheme.colors.error[50],
  '--google-error-100': googleTheme.colors.error[100],
  '--google-background-primary': googleTheme.colors.background.primary,
  '--google-background-secondary': googleTheme.colors.background.secondary,
  '--google-background-tertiary': googleTheme.colors.background.tertiary,
  '--google-text-primary': googleTheme.colors.text.primary,
  '--google-text-secondary': googleTheme.colors.text.secondary,
  '--google-text-tertiary': googleTheme.colors.text.tertiary,
  '--google-text-disabled': googleTheme.colors.text.disabled,
  '--google-border-radius-sm': googleTheme.borderRadius.sm,
  '--google-border-radius-base': googleTheme.borderRadius.base,
  '--google-border-radius-lg': googleTheme.borderRadius.lg,
  '--google-border-radius-full': googleTheme.borderRadius.full,
  '--google-shadow-sm': googleTheme.shadows.sm,
  '--google-shadow-base': googleTheme.shadows.base,
  '--google-shadow-md': googleTheme.shadows.md,
  '--google-shadow-lg': googleTheme.shadows.lg,
  '--google-shadow-xl': googleTheme.shadows.xl,
};
