import { api } from "@/features/common/api";
import { EquipmentType } from "../interface/equipment-type";

export async function getEquipmentTypes() {
    try {
        const response = await api.get<EquipmentType[]>('/equipment/types');
        return response.data;
    } catch (err) {
        console.error("Error al recuperar tipos de equipo", err);
        throw err;
    }
}

export async function getEquipmentType(params: { equipmentTypeId?: number }) {
    try {
        if (!params.equipmentTypeId) {
            return null;
        }
        const response = await api.get<EquipmentType>(`/equipment/types/${params.equipmentTypeId}`);
        return response.data;
    } catch (err) {
        console.error("Error al recuperar tipo de equipo", err);
        throw err;
    }
}


export type CreateEquipmentType = Omit<EquipmentType, "equipmentTypeId">;

export async function createEquipmentType(params: CreateEquipmentType) {
    try {
        const response = await api.post<null>('/equipment/types', params);
        return response.data;
    } catch (err) {
        console.error("Error al crear tipos de equipo", err);
        throw err;
    }
}

export async function updateEquipmentType(params: { equipmentTypeId: number } & CreateEquipmentType) {
    try {
        const response = await api.patch<null>(`/equipment/types/${params.equipmentTypeId}`, params);
        return response.data;
    } catch (err) {
        console.error("Error al editar tipo de equipo", err);
        throw err;
    }
}

export async function deleteEquipmentType(params: { equipmentTypeId: number }) {
    try {
        const response = await api.delete<null>(`/equipment/types/${params.equipmentTypeId}`);
        return response.data;
    } catch (err) {
        console.error("Error al eliminar tipo de equipo", err);
        throw err;
    }
}