export interface PlanConfig {
  readonly name: string;
  readonly maxRecipients: number;
  readonly description: string;
}

export type PlanTier = 'starter' | 'pro' | 'max' | 'ultra';

export type {};
