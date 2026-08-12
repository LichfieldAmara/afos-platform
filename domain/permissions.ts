export const roles = [
  "customer_user",
  "freight_forwarder_user",
  "provider_manager",
  "provider_dispatcher",
  "driver",
  "afos_operations",
  "afos_administrator",
] as const;

export type Role = (typeof roles)[number];

export const permissions = [
  "request:create", "request:read_own", "request:read_all", "request:update_own",
  "request:cancel_own", "provider:manage_own", "provider:verify", "fleet:manage_own",
  "capacity:manage_own", "capacity:read_all", "offer:respond_own", "offer:manage_all",
  "allocation:manage", "trip:read_assigned", "trip:update_assigned", "trip:manage_all",
  "exception:create", "exception:manage_all", "delivery:submit_assigned",
  "delivery:confirm", "audit:read", "access:administer",
] as const;

export type Permission = (typeof permissions)[number];

export const rolePermissions: Record<Role, readonly Permission[]> = {
  customer_user: ["request:create", "request:read_own", "request:update_own", "request:cancel_own"],
  freight_forwarder_user: ["request:create", "request:read_own", "request:update_own", "request:cancel_own"],
  provider_manager: ["provider:manage_own", "fleet:manage_own", "capacity:manage_own", "offer:respond_own", "exception:create"],
  provider_dispatcher: ["fleet:manage_own", "capacity:manage_own", "offer:respond_own", "exception:create"],
  driver: ["trip:read_assigned", "trip:update_assigned", "exception:create", "delivery:submit_assigned"],
  afos_operations: ["request:read_all", "provider:verify", "capacity:read_all", "offer:manage_all", "allocation:manage", "trip:manage_all", "exception:manage_all", "delivery:confirm", "audit:read"],
  afos_administrator: [...permissions],
};

export function hasPermission(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

