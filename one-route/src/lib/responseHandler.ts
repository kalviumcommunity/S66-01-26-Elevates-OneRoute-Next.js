import { NextResponse } from 'next/server';

import { ERROR_CODES, ErrorCodeKey } from '@/lib/errorCodes';

type SuccessEnvelope<T> = {
  success: true;
  message: string;
  data: T;
  timestamp: string;
};

type ErrorEnvelope = {
  success: false;
  message: string;
  error: {
    code: string;
    type: ErrorCodeKey;
    details?: unknown;
  };
  timestamp: string;
};

export const sendSuccess = <T>(data: T, message = 'Success', status = 200) => {
  return NextResponse.json<SuccessEnvelope<T>>(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};

export const sendError = (
  message = 'Something went wrong',
  errorType: ErrorCodeKey = 'INTERNAL_ERROR',
  status = 500,
  details?: unknown
) => {
  const code = ERROR_CODES[errorType] ?? ERROR_CODES.INTERNAL_ERROR;

  return NextResponse.json<ErrorEnvelope>(
    {
      success: false,
      message,
      error: {
        code,
        type: errorType,
        details,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};
