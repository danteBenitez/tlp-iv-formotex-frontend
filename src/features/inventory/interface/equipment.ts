import { EquipmentType } from "./equipment-type";
import { EquipmentUnit } from "./equipment-unit";

export interface Equipment {
    equipmentId: string,
    name: string,
    description: string,
    type?: EquipmentType,
    equipmentUnits: EquipmentUnit[],
    typeId: number,
    make: string,
}