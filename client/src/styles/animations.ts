import { motion } from 'framer-motion';

// Google Material Design inspired animations
export const googleAnimations = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.4, 0.0, 0.2, 1.0] 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.5, 
        ease: [0.4, 0.0, 0.2, 1.0] 
      } 
    },
  },

  // Component entrance animations
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.4, 0.0, 0.2, 1.0] 
      } 
    },
  },

  // Stagger animations for lists
  staggerContainer: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: 'beforeChildren',
        stagger: 0.2,
      } 
    },
  },

  // Google's signature hover effects
  hoverScale: {
    whileHover: { scale: 1.05 },
    animate: { 
      scale: 1,
      transition: { 
        duration: 0.2, 
        ease: [0.4, 0.0, 0.2, 1.0] 
      } 
    },
  },

  // Slide in from bottom
  slideInFromBottom: {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.4, 0.0, 0.2, 1.0] 
      } 
    },
  },

  // Bounce animation for buttons
  buttonBounce: {
    initial: { scale: 1 },
    animate: { 
      scale: [0.95, 1.05],
      transition: { 
        duration: 0.6, 
        ease: [0.3, 0.0, 0.0, 1.0],
        time: 1500,
      } 
    },
  },

  // Loading spinner animation
  loadingSpinner: {
    animate: { 
      rotate: 360,
      transition: { 
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
      } 
    },
  },

  // Ripple effect for buttons
  ripple: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 4,
      opacity: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.4, 0.0, 0.2, 1.0] 
      } 
    },
  },
};
