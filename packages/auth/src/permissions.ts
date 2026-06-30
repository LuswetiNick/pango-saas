import type { ActorContext, AppRole } from "./actor.js"
import { APP_ROLES, isStaffRole } from "./roles.js"

export type Permission =
  "account:read" | "account:manage" | "auth:manage" | "support:read"

const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
  LANDLORD: ["account:read", "account:manage", "auth:manage"],
  TENANT: [],
  ADMIN: ["account:read", "account:manage", "auth:manage", "support:read"],
  SUPPORT: ["account:read", "support:read"],
}

export function hasPermission(
  actor: ActorContext,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[actor.role].includes(permission)
}

export function assertPermission(
  actor: ActorContext,
  permission: Permission
): void {
  if (!hasPermission(actor, permission)) {
    throw new Error(`Missing required permission: ${permission}`)
  }
}

export function canAccessAccount(
  actor: ActorContext,
  resourceAccountId: string
): boolean {
  if (isStaffRole(actor.role)) {
    return true
  }

  return (
    actor.role === APP_ROLES.LANDLORD && actor.accountId === resourceAccountId
  )
}
