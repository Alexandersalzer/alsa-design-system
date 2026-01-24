/**
 * Animation system types - Centralized animation configuration
 * Inspired by the action system architecture
 */

export type AnimationType =
  | 'countUp'
  | 'fadeIn'
  | 'slideIn'
  | 'opacity'
  | 'scale'
  | 'none';

export type EasingType =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'expoOut';

export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'none';

// ===== BASE CONFIG =====
export interface BaseAnimationConfig {
  type: AnimationType;
  settings?: Record<string, any>;
}

// ===== SPECIFIC ANIMATION CONFIGS =====
export interface CountUpAnimationConfig extends BaseAnimationConfig {
  type: 'countUp';
  settings: {
    start?: number;
    end: number;
    duration?: number;
    delay?: number;
    separator?: string;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    easing?: EasingType;
    enableScrollTrigger?: boolean;
    triggerOffset?: number;
  };
}

export interface FadeInAnimationConfig extends BaseAnimationConfig {
  type: 'fadeIn';
  settings?: {
    direction?: AnimationDirection;
    duration?: number;
    delay?: number;
    stagger?: number;
    enableScrollTrigger?: boolean;
    triggerOffset?: number;
  };
}

export interface SlideInAnimationConfig extends BaseAnimationConfig {
  type: 'slideIn';
  settings?: {
    direction?: AnimationDirection;
    duration?: number;
    delay?: number;
    distance?: number;
    easing?: EasingType;
    enableScrollTrigger?: boolean;
    triggerOffset?: number;
  };
}

export interface OpacityAnimationConfig extends BaseAnimationConfig {
  type: 'opacity';
  settings?: {
    duration?: number;
    delay?: number;
    stagger?: number;
    easing?: EasingType;
    enableScrollTrigger?: boolean;
    triggerOffset?: number;
  };
}

export interface ScaleAnimationConfig extends BaseAnimationConfig {
  type: 'scale';
  settings?: {
    from?: number;
    to?: number;
    duration?: number;
    delay?: number;
    easing?: EasingType;
    enableScrollTrigger?: boolean;
    triggerOffset?: number;
  };
}

export interface NoneAnimationConfig extends BaseAnimationConfig {
  type: 'none';
  settings?: never;
}

// ===== UNION TYPE =====
export type AnimationConfig =
  | CountUpAnimationConfig
  | FadeInAnimationConfig
  | SlideInAnimationConfig
  | OpacityAnimationConfig
  | ScaleAnimationConfig
  | NoneAnimationConfig;
