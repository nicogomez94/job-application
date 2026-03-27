-- Add TRIAL plan to SubscriptionPlan enum
ALTER TYPE "SubscriptionPlan" ADD VALUE IF NOT EXISTS 'TRIAL';
