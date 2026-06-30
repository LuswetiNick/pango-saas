export type AppRole = "LANDLORD" | "TENANT" | "ADMIN" | "SUPPORT"

export type ActorContext = Readonly<{
  userId: string
  role: AppRole
  accountId: string | null
  membershipId?: string | null
  email?: string | null
}>
