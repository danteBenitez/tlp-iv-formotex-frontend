import { EquipmentType } from "./equipment-type";

export interface Equipment {
    equipmentId: string,
    name: string,
    description: string,
    type?: EquipmentType,
    typeId: number,
    make: string,
}