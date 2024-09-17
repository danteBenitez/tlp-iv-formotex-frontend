export const MOVEMENT_TYPES = {
  TRANSPORT: "transport",
  DELIVERY: "delivery",
  MAINTENANCE: "mantenimiento",
  ENTRY: "entry",
} as const;

export type MovementType = (typeof MOVEMENT_TYPES)[keyof typeof MOVEMENT_TYPES];
