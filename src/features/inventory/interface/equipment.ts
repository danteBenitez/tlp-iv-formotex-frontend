import { Make } from "../makes/interfaces/make";
import { EquipmentType } from "./equipment-type";
import { EquipmentUnit } from "./equipment-unit";

export interface Equipment {
    equipmentId: string,
    name: string,
    description: string,
    type?: EquipmentType,
    equipmentUnits: EquipmentUnit[],
    typeId: number,
    makeId: number,
    make?: Make
}