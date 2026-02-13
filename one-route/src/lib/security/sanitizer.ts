import sanitizeHtml, { IOptions } from "sanitize-html";

const CONTROL_CHAR_REGEX = /[\u0000-\u001F\u007F]+/g;
const DEFAULT_CONFIG: IOptions = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: "discard",
};

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
};

function stripControlChars(value: string) {
  return value.replace(CONTROL_CHAR_REGEX, "");
}

function stripDangerousProtocols(value: string) {
  return value.replace(/(?:javascript|data|vbscript):/gi, "");
}

export function sanitizeString(value: unknown, options?: IOptions): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = typeof value === "string" ? value : String(value);
  const mergedConfig: IOptions = {
    ...DEFAULT_CONFIG,
    ...options,
    allowedTags: options?.allowedTags ?? DEFAULT_CONFIG.allowedTags,
    allowedAttributes: options?.allowedAttributes ?? DEFAULT_CONFIG.allowedAttributes,
  };

  const sanitized = sanitizeHtml(stringValue, mergedConfig);
  const withoutProtocols = stripDangerousProtocols(sanitized);

  return stripControlChars(withoutProtocols).trim();
}

export function encodeForHTML(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/[&<>"'`]/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

export function sanitizePayload<T>(payload: T): T {
  if (payload === null || payload === undefined) {
    return payload;
  }

  if (typeof payload === "string") {
    return sanitizeString(payload) as T;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizePayload(item)) as unknown as T;
  }

  if (typeof payload === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
      result[key] = sanitizePayload(value);
    }

    return result as T;
  }

  return payload;
}

export function scrubForLogging(meta?: Record<string, unknown>) {
  if (!meta) {
    return undefined;
  }

  const safeMeta: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    safeMeta[key] = typeof value === "string" ? sanitizeString(value) : value;
  }
  return safeMeta;
}
