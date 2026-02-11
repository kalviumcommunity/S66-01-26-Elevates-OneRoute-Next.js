interface LogMetadata {
  [key: string]: any;
}

export const logger = {
  info: (message: string, meta?: LogMetadata) => {
    const logEntry = {
      level: "info",
      message,
      ...(meta && { meta }),
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(logEntry));
  },

  warn: (message: string, meta?: LogMetadata) => {
    const logEntry = {
      level: "warn",
      message,
      ...(meta && { meta }),
      timestamp: new Date().toISOString(),
    };
    console.warn(JSON.stringify(logEntry));
  },

  error: (message: string, meta?: LogMetadata) => {
    const logEntry = {
      level: "error",
      message,
      ...(meta && { meta }),
      timestamp: new Date().toISOString(),
    };
    console.error(JSON.stringify(logEntry));
  },

  debug: (message: string, meta?: LogMetadata) => {
    if (process.env.NODE_ENV === "development") {
      const logEntry = {
        level: "debug",
        message,
        ...(meta && { meta }),
        timestamp: new Date().toISOString(),
      };
      console.log(JSON.stringify(logEntry));
    }
  },
};
