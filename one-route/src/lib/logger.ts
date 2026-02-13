import { scrubForLogging, sanitizeString } from "@/lib/security/sanitizer";

interface LogMetadata {
  [key: string]: any;
}

export const logger = {
  info: (message: string, meta?: LogMetadata) => {
    const logEntry = {
      level: "info",
      message: sanitizeString(message),
      ...(meta && { meta: scrubForLogging(meta) }),
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(logEntry));
  },

  warn: (message: string, meta?: LogMetadata) => {
    const logEntry = {
      level: "warn",
      message: sanitizeString(message),
      ...(meta && { meta: scrubForLogging(meta) }),
      timestamp: new Date().toISOString(),
    };
    console.warn(JSON.stringify(logEntry));
  },

  error: (message: string, meta?: LogMetadata) => {
    const logEntry = {
      level: "error",
      message: sanitizeString(message),
      ...(meta && { meta: scrubForLogging(meta) }),
      timestamp: new Date().toISOString(),
    };
    console.error(JSON.stringify(logEntry));
  },

  debug: (message: string, meta?: LogMetadata) => {
    if (process.env.NODE_ENV === "development") {
      const logEntry = {
        level: "debug",
        message: sanitizeString(message),
        ...(meta && { meta: scrubForLogging(meta) }),
        timestamp: new Date().toISOString(),
      };
      console.log(JSON.stringify(logEntry));
    }
  },
};
