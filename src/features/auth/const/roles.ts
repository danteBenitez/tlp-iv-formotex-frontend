export const ROLES = {
    ADMIN: "admin",
    EMPLOYEE: "employee"
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];