export const ROLES = {
    ADMIN: "admin",
    EMPLOYEE: "employee"
} as const;

export const ROLE_NAMES = [ROLES.ADMIN, ROLES.EMPLOYEE] as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];