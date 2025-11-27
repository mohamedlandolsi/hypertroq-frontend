'use client';

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

// Animation variants for page transitions
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -8,
  },
};

// Stagger children animation
const containerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// PageWrapper - Wraps page content with fade+slide animation
// Use this component to wrap your page content for smooth route transitions
export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  );
}

// StaggerContainer - Container that staggers children animations
// Useful for lists of cards or grid items
export function StaggerContainer({ 
  children, 
  className 
}: PageWrapperProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// StaggerItem - Individual item that animates within StaggerContainer
export function StaggerItem({ 
  children, 
  className 
}: PageWrapperProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// FadeIn - Simple fade in animation wrapper
export function FadeIn({ 
  children, 
  className,
  delay = 0,
}: PageWrapperProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// SlideIn - Slide in from specified direction
export function SlideIn({ 
  children, 
  className,
  direction = 'up',
  delay = 0,
}: PageWrapperProps & { 
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}) {
  const directionOffset = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: 24 },
    right: { x: -24 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction],
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ScaleIn - Scale in animation with optional spring physics
export function ScaleIn({ 
  children, 
  className,
  delay = 0,
}: PageWrapperProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.95,
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
