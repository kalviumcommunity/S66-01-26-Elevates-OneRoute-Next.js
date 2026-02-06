export const ERROR_CODES = {
  VALIDATION_ERROR: 'E001',
  NOT_FOUND: 'E002',
  DATABASE_FAILURE: 'E003',
  INTERNAL_ERROR: 'E500',
} as const;

export type ErrorCodeKey = keyof typeof ERROR_CODES;
