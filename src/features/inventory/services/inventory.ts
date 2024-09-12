import { api } from "@/features/common/api";
import { Equipment } from "../interface/equipment";
import { EquipmentType } from "../interface/equipment-type";
import { EquipmentUnit } from "../interface/equipment-unit";

export async function getAllEquipment() {
    try {
        const response = await api.get<Equipment[]>('/equipment');
        return response.data;
    } catch (err) {
        console.error("Error al recuperar equipamiento", err);
    }
}

type GetEquipmentResponse = {
    equipment: Equipment,
    units: EquipmentUnit[]
};

export async function getEquipment(params: { equipmentId: number }): Promise<GetEquipmentResponse> {
    try {
        const equipmentPromise = (await api.get<Equipment>(`/equipment/${params.equipmentId}`)).data;
        const unitsPromise = (await api.get<EquipmentUnit[]>(`/equipments/${params.equipmentId}/units`)).data
        const [equipment, units] = await Promise.all([equipmentPromise, unitsPromise]);

        return {
            equipment,
            units
        };
    } catch (err) {
        console.error(`Error al recuperar equipamiento con ID: ${params.equipmentId}`, err);
        throw err;
    }
}

export async function getEquipmentTypes() {
    try {
        const response = await api.get<EquipmentType[]>('/equipment/types');
        return response.data;
    } catch (err) {
        console.error("Error al recuperar tipos de equipamiento", err);
    }
}