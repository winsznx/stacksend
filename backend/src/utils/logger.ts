type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

const minLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[minLevel];
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('debug')) console.debug(`[DEBUG] ${message}`, meta ?? '');
  },
  info(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('info')) console.info(`[INFO] ${message}`, meta ?? '');
  },
  warn(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('warn')) console.warn(`[WARN] ${message}`, meta ?? '');
  },
  error(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('error')) console.error(`[ERROR] ${message}`, meta ?? '');
  },
};

export type {};
