import { NextResponse } from "next/server";
import { logger } from "./logger";
import { ZodError } from "zod";
import { sanitizePayload, sanitizeString } from "@/lib/security/sanitizer";

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = "INTERNAL_ERROR",
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(error: any, context: string) {
  const isProd = process.env.NODE_ENV === "production";
  let statusCode = 500;
  let message = "Something went wrong. Please try again later.";
  let errorCode = "INTERNAL_ERROR";
  let details = null;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = isProd ? "Something went wrong. Please try again later." : error.message;
    errorCode = error.code;
    details = error.details ? sanitizePayload(error.details) : null;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    errorCode = "VALIDATION_ERROR";
    details = error.issues.map((issue) => ({
      field: issue.path[0],
      message: sanitizeString(issue.message),
    }));
  } else if (error instanceof Error) {
    message = isProd ? "Something went wrong. Please try again later." : error.message;
  }

  const sanitizedDetails = details ? sanitizePayload(details) : null;
  const clientMessage = sanitizeString(message);

  const logMeta = {
    context,
    errorCode,
    message: sanitizeString(error?.message || clientMessage || "Unknown error"),
    stack: isProd ? "[REDACTED]" : error?.stack,
    ...(sanitizedDetails && { details: sanitizedDetails }),
  };

  logger.error(`Error in ${context}`, logMeta);

  const response: any = {
    success: false,
    message: clientMessage,
    error: {
      code: getErrorCode(errorCode, statusCode),
      type: errorCode,
    },
  };

  if (!isProd && sanitizedDetails) {
    response.details = sanitizedDetails;
  }

  if (!isProd && error?.stack) {
    response.stack = error.stack;
  }

  return NextResponse.json(response, { status: statusCode });
}

function getErrorCode(type: string, statusCode: number): string {
  const codeMap: Record<string, string> = {
    VALIDATION_ERROR: "E001",
    NOT_FOUND: "E002",
    DATABASE_FAILURE: "E003",
    UNAUTHORIZED: "E401",
    FORBIDDEN: "E403",
    DUPLICATE_USER: "E409",
    INVALID_PASSWORD: "E401",
    USER_NOT_FOUND: "E404",
    INTERNAL_ERROR: "E500",
  };

  return codeMap[type] || `E${statusCode}`;
}
