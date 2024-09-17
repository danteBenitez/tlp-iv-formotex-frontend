import { User } from "@/features/auth/interfaces/user";
import { MOVEMENT_TYPES } from "../consts/movement-types";
import { EquipmentUnit } from "./equipment-unit";
import { Organization } from "./organization";

export type Movement = {
    movementId: number,
    equipmentUnitId: number,
    unit: EquipmentUnit,
    movementTypeId: number,
    author?: User,
} & ({
    // Dependiendo del tipo, varían los detalles
    // del movimiento
    type: { name: typeof MOVEMENT_TYPES.MAINTENANCE },
    details: {
        startedAt: string,
        endedAt: string
    }
} | {
    type: { name: typeof MOVEMENT_TYPES.DELIVERY },
    details: {
        organization: Organization
    }
});
