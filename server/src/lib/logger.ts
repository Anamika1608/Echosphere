import pino, { Logger } from 'pino';

interface LoggerOptions {
  level?: string;
  enabled?: boolean;
}

const defaultOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  enabled: process.env.NODE_ENV !== 'test', 
};

const logger: Logger = pino({
  name: 'harassment-reporting-api',
  level: defaultOptions.level,
  enabled: defaultOptions.enabled,
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

export { logger };