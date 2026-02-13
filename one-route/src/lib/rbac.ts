import { AppError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import {
  hasPermission,
  normalizeRole,
  Permission,
  Role,
  roleHasPermission,
} from "@/config/roles";

interface PermissionContext {
  role: string | null;
  permission: Permission;
  resource: string;
  actor?: string | null;
  source: string;
}

export function logPermissionDecision(
  ctx: PermissionContext & { allowed: boolean; resolvedRole: Role | null }
) {
  logger.info("[RBAC] permission check", {
    role: ctx.resolvedRole ?? "ANONYMOUS",
    permission: ctx.permission,
    resource: ctx.resource,
    source: ctx.source,
    actor: ctx.actor,
    allowed: ctx.allowed,
  });
}

export function checkPermission(ctx: PermissionContext) {
  const resolvedRole = normalizeRole(ctx.role);
  const allowed = resolvedRole ? roleHasPermission(resolvedRole, ctx.permission) : false;
  logPermissionDecision({ ...ctx, allowed, resolvedRole });
  return allowed;
}

export function enforcePermission(ctx: PermissionContext, failureMessage?: string) {
  const allowed = checkPermission(ctx);
  if (!allowed) {
    throw new AppError(
      failureMessage ?? "Access denied: insufficient permissions",
      "FORBIDDEN",
      403
    );
  }
}

export function can(role: string | null | undefined, permission: Permission) {
  return hasPermission(role ?? null, permission);
}
