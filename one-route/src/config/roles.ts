export const ROLES = ["STUDENT", "MENTOR", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "applications.view",
  "applications.manage",
  "users.read",
  "users.create",
  "users.promote",
  "reports.view",
  "admin.access",
  "admin.manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export type RoleDefinition = {
  description: string;
  permissions: Permission[];
  inherits?: Role[];
};

export const ROLE_DEFINITIONS: Record<Role, RoleDefinition> = {
  STUDENT: {
    description: "Track their own internship/job applications and view personal analytics",
    permissions: ["applications.view"],
  },
  MENTOR: {
    description: "Guide cohorts by reviewing applications, notes, and reports",
    inherits: ["STUDENT"],
    permissions: ["applications.manage", "users.read", "reports.view"],
  },
  ADMIN: {
    description: "Operate the whole platform and manage user access",
    inherits: ["MENTOR"],
    permissions: ["users.create", "users.promote", "admin.access", "admin.manage"],
  },
};

function buildRolePermissions(): Record<Role, Permission[]> {
  const resolved: Partial<Record<Role, Permission[]>> = {};

  const resolve = (role: Role, visited: Set<Role> = new Set()): Permission[] => {
    if (resolved[role]) {
      return resolved[role]!;
    }

    if (visited.has(role)) {
      return [];
    }
    visited.add(role);

    const definition = ROLE_DEFINITIONS[role];
    const permissions = new Set<Permission>(definition.permissions);

    definition.inherits?.forEach((inheritedRole) => {
      resolve(inheritedRole, visited).forEach((permission) => permissions.add(permission));
    });

    const value = Array.from(permissions);
    resolved[role] = value;
    return value;
  };

  return ROLES.reduce((acc, role) => {
    acc[role] = resolve(role);
    return acc;
  }, {} as Record<Role, Permission[]>);
}

export const ROLE_PERMISSIONS = buildRolePermissions();

export const PERMISSION_LABELS: Record<Permission, string> = {
  "applications.view": "Read personal dashboard & stats",
  "applications.manage": "Update mentee applications and leave notes",
  "users.read": "Browse the user directory",
  "users.create": "Add new platform members",
  "users.promote": "Escalate a user's role",
  "reports.view": "Open analytics and cohort reports",
  "admin.access": "Reach privileged admin endpoints",
  "admin.manage": "Mutate platform-level settings",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = Object.fromEntries(
  ROLES.map((role) => [role, ROLE_DEFINITIONS[role].description])
) as Record<Role, string>;

export function normalizeRole(role?: string | null): Role | null {
  if (!role) {
    return null;
  }

  const normalized = role.toUpperCase() as Role;
  return ROLES.includes(normalized) ? normalized : null;
}

export function roleHasPermission(role: Role, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasPermission(roleInput: string | null | undefined, permission: Permission) {
  const role = normalizeRole(roleInput);
  if (!role) {
    return false;
  }
  return roleHasPermission(role, permission);
}

export function listRolePermissions(roleInput: string | null | undefined) {
  const role = normalizeRole(roleInput);
  if (!role) {
    return [];
  }
  return ROLE_PERMISSIONS[role];
}
