import type { AppRole } from "./actor.js"

export const APP_ROLES = {
  LANDLORD: "LANDLORD",
  TENANT: "TENANT",
  ADMIN: "ADMIN",
  SUPPORT: "SUPPORT",
} as const satisfies Record<AppRole, AppRole>

export const ACCOUNT_SCOPED_ROLES = [
  APP_ROLES.LANDLORD,
  APP_ROLES.TENANT,
] as const

export const STAFF_ROLES = [APP_ROLES.ADMIN, APP_ROLES.SUPPORT] as const

const appRoleSet = new Set<AppRole>(Object.values(APP_ROLES))
const accountScopedRoleSet = new Set<AppRole>(ACCOUNT_SCOPED_ROLES)
const staffRoleSet = new Set<AppRole>(STAFF_ROLES)

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && appRoleSet.has(value as AppRole)
}

export function isAccountScopedRole(role: AppRole): boolean {
  return accountScopedRoleSet.has(role)
}

export function isStaffRole(role: AppRole): boolean {
  return staffRoleSet.has(role)
}
