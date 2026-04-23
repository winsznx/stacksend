export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const TRANSITION_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

export type {};

export type AnimationSpeed = keyof typeof ANIMATION_DURATION;
