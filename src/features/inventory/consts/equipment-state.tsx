import { CheckCircle, ServerCrash } from "lucide-react";
import { ReactNode } from "react";

export const EQUIPMENT_STATES = {
  /** En buen estado */
  OK: "ok",
  /** Necesita reparaciones */
  NEEDS_REPAIR: "needs_repair",
} as const;

export type EquipmentState =
  (typeof EQUIPMENT_STATES)[keyof typeof EQUIPMENT_STATES];

export const ALLOWED_EQUIPMENT_STATES = [
  EQUIPMENT_STATES.OK,
  EQUIPMENT_STATES.NEEDS_REPAIR,
] as const;

export const DISPLAY_STATES: Record<EquipmentState, string> = {
  [EQUIPMENT_STATES.OK]: "Funcionando",
  [EQUIPMENT_STATES.NEEDS_REPAIR]: "Necesita reparación",
};

export const STATE_TO_CLASSNAME: Record<EquipmentState, string> = {
  [EQUIPMENT_STATES.NEEDS_REPAIR]: "border-red-500",
  [EQUIPMENT_STATES.OK]: "border-green-400",
};
export const STATE_TO_ICON: Record<EquipmentState, ReactNode> = {
  [EQUIPMENT_STATES.NEEDS_REPAIR]: <ServerCrash className="size-4" />,
  [EQUIPMENT_STATES.OK]: <CheckCircle className="size-4" />,
};
