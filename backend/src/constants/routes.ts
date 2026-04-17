export const ROUTES = {
  HEALTH: '/health',
  WEBHOOK_STX: '/api/webhooks/stx-transfer',
  WEBHOOK_FT: '/api/webhooks/ft-transfer',
  TELEGRAM_LINK: '/api/telegram/link',
  USER: '/api/users/:address',
  USER_ACTIVITY: '/api/users/:address/activity',
  USER_NOTIFICATIONS: '/api/users/:address/notifications',
  TRANSFERS_RECENT: '/api/transfers/recent',
} as const;

export type {};
