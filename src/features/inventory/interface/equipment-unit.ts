import { EquipmentState } from "../consts/equipment-state";
import { Equipment } from "./equipment";
import { Organization } from "./organization";

export interface EquipmentUnit {
    equipmentUnitId: number,
    serialNumber: number,
    equipment?: Equipment,
    equipmentId: number,
    state: EquipmentState
    acquiredAt: Date,
    organizationId: number,
    organization?: Organization,
    location: string,
}